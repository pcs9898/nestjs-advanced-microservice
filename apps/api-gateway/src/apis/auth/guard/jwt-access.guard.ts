import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/common/decorator/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtUnVerifiedGuardAllowPath } from '../constants/auth.constants';

@Injectable()
export class JwtAccessGuard extends AuthGuard('access') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const http = context.switchToHttp();
    const request: Request = http.getRequest();

    if (
      JwtUnVerifiedGuardAllowPath.some((path) => request.path.includes(path))
    ) {
      return true;
    }

    return super.canActivate(context);
  }
}
