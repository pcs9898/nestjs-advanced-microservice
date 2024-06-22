import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import jwtConfig from './user/common/config/jwt.config';
import mailConfig from './user/common/config/mail.config';
import postgresConfig from './user/common/config/postgres.config';
import redisConfig from './user/common/config/redis.config';
import sentryConfig from './user/common/config/sentry.config';
import slackConfig from './user/common/config/slack.config';
import { UserModule } from './user/user.module';
import { LoggerMiddleware } from './user/common/middleware/logger.middleware';

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
    UserModule,
  ],
  providers: [],
})
export class AppModule {}
