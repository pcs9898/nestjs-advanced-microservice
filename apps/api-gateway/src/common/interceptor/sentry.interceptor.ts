import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, catchError } from 'rxjs';
import { Request as ExpressRequest } from 'express';
import * as Sentry from '@sentry/node';
import { IncomingWebhook } from '@slack/webhook';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest<ExpressRequest>();
    const { url } = request;

    return next.handle().pipe(
      catchError((error) => {
        Sentry.captureException(error);
        const webhook = new IncomingWebhook(
          this.configService.get('slack.webhook'),
        );
        webhook.send({
          attachments: [
            {
              text: 'Nestjs project error occurred',
              fields: [
                {
                  title: `Error message: ${error.response?.message || error.message}`,
                  value: `URL: ${url}\n${error.stack}`,
                },
              ],
              ts: Math.floor(new Date().getTime() / 1000).toString(),
            },
          ],
        });
        throw error;
      }),
    );
  }
}
