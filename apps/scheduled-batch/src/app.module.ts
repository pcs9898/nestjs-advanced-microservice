import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import jwtConfig from './common/config/jwt.config';
import mailConfig from './common/config/mail.config';
import postgresConfig from './common/config/postgres.config';
import redisConfig from './common/config/redis.config';
import sentryConfig from './common/config/sentry.config';
import slackConfig from './common/config/slack.config';
import { ScheduledBatchModule } from './scheduled-batch/scheduled-batch.module';

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
    ScheduledBatchModule,
  ],
})
export class AppModule {}
