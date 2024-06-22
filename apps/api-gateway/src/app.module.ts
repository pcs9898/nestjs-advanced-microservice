import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import jwtConfig from './common/config/jwt.config';
import mailConfig from './common/config/mail.config';
import postgresConfig from './common/config/postgres.config';
import redisConfig from './common/config/redis.config';
import sentryConfig from './common/config/sentry.config';
import slackConfig from './common/config/slack.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './apis/auth/auth.module';
import { HealthModule } from './apis/health/health.module';
import { ScheduledBatchModule } from './apis/scheduled-batch/scheduled-batch.module';
import { UserModule } from './apis/user/user.module';
import { VideoModule } from './apis/video/video.module';
import { AnalyticsModule } from './apis/analytics/analytics.module';
import { JwtAccessGuard } from './apis/auth/guard/jwt-access.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [
        jwtConfig,
        mailConfig,
        postgresConfig,
        redisConfig,
        redisConfig,
        sentryConfig,
        slackConfig,
      ],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        let obj: TypeOrmModuleOptions = {
          type: 'postgres',
          host: configService.get('postgres.host'),
          port: configService.get('postgres.port'),
          database: configService.get('postgres.database'),
          username: configService.get('postgres.username'),
          password: configService.get('postgres.password'),
          autoLoadEntities: true,
        };

        if (configService.get('NODE_ENV') === 'development') {
          console.info('Sync Typeorm');
          obj = Object.assign(obj, { synchronize: true, logging: true });
        }
        return obj;
      },
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        console.log(configService.get('redis.dbNumber'));
        const obj = {
          readyLog: true,
          errorLog: true,
          config: {
            host: configService.get('redis.host'),
            port: configService.get('redis.port'),
            password: configService.get('redis.password'),
            db: configService.get('redis.dbNumber'),
          },
        };

        return obj;
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    AnalyticsModule,
    AuthModule,
    HealthModule,
    ScheduledBatchModule,
    UserModule,
    VideoModule,
  ],
  providers: [
    // TO Do add access guard as providing app_guard
    Logger,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
