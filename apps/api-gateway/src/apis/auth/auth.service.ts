import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SigninReqDto, SignupReqDto } from './dto/req.dto';
import { DataSource } from 'typeorm';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import {
  RestoreAccessTokenResDto,
  SigninResDto,
  SignupResDto,
  VerifyAuthCodeResDto,
} from './dto/res.dto';
import { User } from '../user/entity/user.entity';
import * as bcrypt from 'bcrypt';
import {
  SALT_ROUNDS,
  THIRTY_DAYS_IN_SECONDS,
  TWENTY_MINUTES_IN_SECONDS,
} from './constants/auth.constants';
import * as crypto from 'crypto';
import {
  IAuthServiceRestoreAccessToken,
  TAuthServiceSaveAuthCodeOnRedis,
  IAuthServiceSaveHashedRefreshTokenOnRedis,
  IAuthServiceVerifyEmailAuthCode,
} from './interface/auth-service.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async signup(data: SignupReqDto): Promise<SignupResDto> {
    const { email, password, passwordConfirm } = data;

    if (password !== passwordConfirm)
      throw new BadRequestException('Password do not match');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let error;
    let userId: string;

    try {
      const user = await queryRunner.manager.findOneBy(User, { email });
      if (user) throw new UnprocessableEntityException('User already exists');

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const userEntity = await queryRunner.manager.save(
        await queryRunner.manager.create(User, {
          email,
          password: hashedPassword,
        }),
      );

      userId = userEntity.id;

      const authCode = this.generateAuthCode();

      await this.saveAuthCodeOnRedis({
        userId,
        authCode,
        ttl: TWENTY_MINUTES_IN_SECONDS,
      });

      const unVerifiedToken = this.generateUnVerifiedToken(userId);

      await this.mailService.sendAuthCode({
        email: userEntity.email,
        authCode,
      });

      await queryRunner.commitTransaction();

      return {
        id: userId,
        unVerifiedToken,
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      error = e;

      await this.deleteAuthCodeOnRedis(userId);
    } finally {
      await queryRunner.release();
      if (error) throw error;
    }
  }

  async verifyAuthCode({
    userId,
    authCode: stringAuthCode,
  }: IAuthServiceVerifyEmailAuthCode): Promise<VerifyAuthCodeResDto> {
    const authCode = Number(stringAuthCode);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let error;
    let leftTtl;

    try {
      // Already check user exist or not at JwtUnVerifiedGuard
      // const user = queryRunner.manager.findOneBy(User, {id:user_id});

      const foundAuthCode = await this.findAuthCodeOnRedis(userId);
      if (!foundAuthCode)
        throw new BadRequestException(
          'Auth code has expired in 20min, please reissue it',
        );
      if (foundAuthCode !== authCode)
        throw new BadRequestException('Auth code is not match');

      await queryRunner.manager.update(
        User,
        { id: userId },
        { isVerified: true },
      );

      // Get left ttl for if happen error
      leftTtl = await this.getLeftTtlAuthCodeOnRedis(userId);

      await this.deleteAuthCodeOnRedis(userId);

      const { accessToken, refreshToken, hashedRefreshToken } =
        this.generateAccessNRefreshNHashedRefreshToken(userId);

      await this.saveHashedRefreshTokenOnRedis({ userId, hashedRefreshToken });

      await queryRunner.commitTransaction();

      return {
        accessToken,
        refreshToken,
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();

      // if error occurred, recover authCode on redis with left ttl
      if (leftTtl > 0) {
        await this.saveAuthCodeOnRedis({ userId, authCode, ttl: leftTtl });
      }
      error = e;
    } finally {
      await queryRunner.release();
      if (error) throw error;
    }
  }

  async resendAuthCode(userId: string): Promise<boolean> {
    try {
      const authCode = this.generateAuthCode();

      await this.saveAuthCodeOnRedis({
        userId,
        authCode,
        ttl: TWENTY_MINUTES_IN_SECONDS,
      });

      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async signin({ email, password }: SigninReqDto): Promise<SigninResDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let error;
    let userId: string;

    try {
      const user = await queryRunner.manager.findOneBy(User, { email });
      userId = user.id;

      if (!user) throw new NotFoundException('User not exist');

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch)
        throw new UnauthorizedException('Password not match');

      if (!user.isVerified) {
        const authCode = this.generateAuthCode();

        await this.saveAuthCodeOnRedis({
          userId,
          authCode,
          ttl: TWENTY_MINUTES_IN_SECONDS,
        });

        const unVerifiedToken = this.generateUnVerifiedToken(userId);

        await queryRunner.commitTransaction();

        return {
          unVerifiedToken,
        };
      } else {
        const { accessToken, refreshToken, hashedRefreshToken } =
          this.generateAccessNRefreshNHashedRefreshToken(userId);

        await this.saveHashedRefreshTokenOnRedis({
          userId,
          hashedRefreshToken,
        });

        await queryRunner.commitTransaction();

        return {
          accessToken,
          refreshToken,
        };
      }
    } catch (e) {
      await queryRunner.rollbackTransaction();
      error = e;

      if (userId) {
        await this.deleteAuthCodeOnRedis(userId);
      }
    } finally {
      await queryRunner.release();
      if (error) throw error;
    }
  }

  async restoreAccessToken({
    userId,
    refreshToken: oldRefreshToken,
  }: IAuthServiceRestoreAccessToken): Promise<RestoreAccessTokenResDto> {
    try {
      const foundHashedRefreshToken =
        await this.findHashedRefreshTokenOnRedis(userId);
      if (!foundHashedRefreshToken)
        throw new UnauthorizedException('You are already sign out');

      const hashedOldRefreshToken =
        await this.generateHashedRefreshToken(oldRefreshToken);
      if (foundHashedRefreshToken !== hashedOldRefreshToken)
        throw new UnauthorizedException('Wrong refresh token');

      const { accessToken, refreshToken, hashedRefreshToken } =
        await this.generateAccessNRefreshNHashedRefreshToken(userId);

      console.log(hashedRefreshToken);
      await this.saveHashedRefreshTokenOnRedis({ userId, hashedRefreshToken });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async signout(userId: string): Promise<boolean> {
    try {
      const foundHashedRefreshToken =
        await this.findHashedRefreshTokenOnRedis(userId);
      if (!foundHashedRefreshToken)
        throw new BadRequestException('You are already sign out');

      await this.deleteHashedRefreshTokenOnRedis(userId);

      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  private generateAuthCode(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  private async saveAuthCodeOnRedis({
    userId,
    authCode,
    ttl,
  }: TAuthServiceSaveAuthCodeOnRedis) {
    await this.redis.set(`auth_code:${userId}`, authCode, 'EX', ttl);
  }

  private async deleteAuthCodeOnRedis(userId: string): Promise<void> {
    await this.redis.del(`auth_code:${userId}`);
  }

  private async findAuthCodeOnRedis(userId: string): Promise<number | null> {
    const authCode = await this.redis.get(`auth_code:${userId}`);
    return authCode ? Number(authCode) : null;
  }

  private async getLeftTtlAuthCodeOnRedis(userId: string): Promise<number> {
    return await this.redis.ttl(`auth_code:${userId}`);
  }

  private generateUnVerifiedToken(userId: string) {
    const payload = { sub: userId, tokenType: 'unVerifiedToken' };

    return this.jwtService.sign(payload, {
      expiresIn: '20m',
      secret: this.configService.get('jwt.unVerifiedSecret'),
    });
  }

  private generateAccessNRefreshNHashedRefreshToken(userId: string) {
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = this.generateRefreshToken(userId);
    const hashedRefreshToken = this.generateHashedRefreshToken(refreshToken);

    return { accessToken, refreshToken, hashedRefreshToken };
  }

  private generateAccessToken(userId: string) {
    const payload = { sub: userId, tokenType: 'accessToken' };

    return this.jwtService.sign(payload, {
      expiresIn: '1h',
      secret: this.configService.get('jwt.accessSecret'),
    });
  }

  private generateRefreshToken(userId: string) {
    const payload = { sub: userId, tokenType: 'refreshToken' };

    return this.jwtService.sign(payload, {
      expiresIn: '30d',
      secret: this.configService.get('jwt.refreshSecret'),
    });
  }

  private generateHashedRefreshToken(refreshToken: string): string {
    return crypto.createHash('sha256').update(refreshToken).digest('hex');
  }

  private async saveHashedRefreshTokenOnRedis({
    userId,
    hashedRefreshToken,
  }: IAuthServiceSaveHashedRefreshTokenOnRedis) {
    await this.redis.set(
      `refresh_token:${userId}`,
      hashedRefreshToken,
      'EX',
      THIRTY_DAYS_IN_SECONDS,
    );
  }

  private async findHashedRefreshTokenOnRedis(userId: string) {
    return await this.redis.get(`refresh_token:${userId}`);
  }

  private async deleteHashedRefreshTokenOnRedis(userId: string) {
    return await this.redis.del(`refresh_token:${userId}`);
  }
}
