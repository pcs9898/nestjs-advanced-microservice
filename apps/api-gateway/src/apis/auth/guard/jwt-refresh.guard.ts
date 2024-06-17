import {
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('refresh') {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(Logger) private logger: LoggerService,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const http = context.switchToHttp();
    const request = http.getRequest();

    const authorization = request.headers['authorization']; // this just for test. in real world, need to put refresh token in cookie
    if (!authorization || !authorization.includes('Bearer'))
      throw new UnauthorizedException();

    const refreshToken = /Bearer\s(.+)/.exec(authorization)[1];
    if (!refreshToken) throw new UnauthorizedException('Token is required');

    const decoded = this.jwtService.decode(refreshToken);

    if (!decoded || decoded['tokenType'] !== 'refreshToken') {
      const error = new UnauthorizedException('RefreshToken is required');
      this.logger.error(error.message, error.stack);
      throw error;
    }

    request.refreshToken = refreshToken;

    return super.canActivate(context);
  }
}
