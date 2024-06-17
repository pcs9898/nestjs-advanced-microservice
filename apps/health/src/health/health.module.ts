import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [
    {
      provide: 'HEALTH_SERVICE',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: 'health-service',
            port: 3004,
          },
        });
      },
    },
  ],
})
export class HealthModule {}
