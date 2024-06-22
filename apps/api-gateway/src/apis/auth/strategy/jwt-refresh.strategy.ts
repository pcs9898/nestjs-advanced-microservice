import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from 'src/common/types/global-types';
import { UserService } from 'src/apis/user/user.service';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    @Inject('USER_SERVICE') private userClient: ClientProxy,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.refreshSecret'),
    });
  }

  async validate(payload: IJwtPayload) {
    const id = payload.sub;

    const user = await firstValueFrom(
      this.userClient.send({ cmd: 'findUserById' }, { id }),
    );

    if (!user) {
      throw new NotFoundException('User not exist');
    }

    return { id };
  }
}
