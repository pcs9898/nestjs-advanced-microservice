import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ScheduleModule } from '@nestjs/schedule';
import {
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ClientsModule.register([
      {
        name: 'MAIL_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'mail',
            brokers: ['host.docker.internal:9092'],
          },
          consumer: {
            groupId: 'mail-consumer',
          },
        },
      },
    ]),
  ],
  providers: [
    AnalyticsService,
    {
      provide: 'VIDEO_SERVICE',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: 'video-service',
            port: 3002,
          },
        });
      },
    },
  ],
})
export class AnalyticsModule {}
