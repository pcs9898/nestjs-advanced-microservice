import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { pageReqDto } from './common/dto/req.dto';
import { UserRole } from './common/enum/global-enum';
import { SignupReqDto } from './dto/req.dto';
import * as bcrypt from 'bcrypt';

export interface IUserServiceUserIsUserAdmin {
  user_id: string;
}

export const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll(data: pageReqDto): Promise<User[]> {
    const { page, size } = data;

    const users = await this.userRepository.find({
      skip: (page - 1) * size,
      take: size,
    });

    return users;
  }

  async findUserById({ id }: { id: string }) {
    const user = await this.userRepository.findOne({ where: { id } });

    return user;
  }

  async findUserByEmail({ email }: { email: string }): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    return user;
  }

  async isUserAdmin({ id }: { id: string }): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    return user;
  }

  async createUser(data: SignupReqDto): Promise<User> {
    const { email, password } = data;

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await this.userRepository.save({
      email,
      password: hashedPassword,
    });

    return user;
  }

  async updateUserVerified({ id }: { id: string }): Promise<boolean> {
    try {
      await this.userRepository.update({ id }, { isVerified: true });
      return true;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async IsUserAdmin({
    user_id,
  }: IUserServiceUserIsUserAdmin): Promise<boolean> {
    const user = await this.findUserById({ id: user_id });

    return user.role === UserRole.Admin;
  }

  async removeUnVerifiedUserOver30Days() {
    const thirtyDays = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const usersShouldRemove = await this.userRepository
      .createQueryBuilder()
      .select()
      .where('is_verified=:is_verified', { is_verified: false })
      .andWhere('created_at<:thirtyDays', { thirtyDays })
      .getMany();

    for (const user of usersShouldRemove) {
      await this.userRepository.remove(user);
    }
  }
}
