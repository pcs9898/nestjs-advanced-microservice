import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/apis/user/user.service';
import { IJwtPayload } from 'src/common/types/global-types';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.accessSecret'),
    });
  }

  async validate(payload: IJwtPayload) {
    const id = payload.sub;
    const user = await this.userService.findOneById({ id });

    if (!user) {
      throw new NotFoundException('User not exist');
    }

    return { id };
  }
}
