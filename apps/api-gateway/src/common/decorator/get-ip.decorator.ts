import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetIp = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();

    const clientIp =
      request.headers['x-forwarded-for'] ||
      request.connection.remoteAddress ||
      request.ip;

    return clientIp;
  },
);
