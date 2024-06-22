import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from 'src/common/types/global-types';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtUnVerifiedStrategy extends PassportStrategy(
  Strategy,
  'unVerified',
) {
  constructor(
    private readonly configService: ConfigService,
    @Inject('USER_SERVICE') private userClient: ClientProxy,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.unVerifiedSecret'),
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

    if (user.isVerified) {
      throw new UnauthorizedException('User already verified');
    }

    return { id, email: user.email };
  }
}
