import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import { SentryInterceptor } from './common/interceptor/sentry.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map(
          (error) => `${Object.values(error.constraints)}`,
        );

        return new BadRequestException(messages.toString());
      },
    }),
  );

  // security
  app.use(helmet());

  // swagger
  const config = new DocumentBuilder()
    .setTitle('Nestjs advanced')
    .setDescription('The Nestjs advanced API description')
    .setVersion('1.0')
    .addTag('nestjs')
    .addBearerAuth()
    .build();

  const swaggerCustomOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, swaggerCustomOptions);

  // Sentry
  Sentry.init({
    dsn: configService.get('sentry.dsn'),
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
  app.useGlobalInterceptors(new SentryInterceptor(configService));

  await app.listen(3000);

  console.info(`NODE_ENV: ${configService.get('NODE_ENV')}`);
}
bootstrap();
