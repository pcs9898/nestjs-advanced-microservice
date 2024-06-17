import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from 'src/common/types/global-types';
import { UserService } from 'src/apis/user/user.service';

@Injectable()
export class JwtUnVerifiedStrategy extends PassportStrategy(
  Strategy,
  'unVerified',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.unVerifiedSecret'),
    });
  }

  async validate(payload: IJwtPayload) {
    const id = payload.sub;
    const user = await this.userService.findOneById({ id });

    if (!user) {
      throw new NotFoundException('User not exist');
    }

    if (user.isVerified) {
      throw new UnauthorizedException('User already verified');
    }

    return { id };
  }
}
