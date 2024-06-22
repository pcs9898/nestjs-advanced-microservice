import { ClientsModule, Transport } from '@nestjs/microservices';
import { Module } from '@nestjs/common';
import { ScheduledBatchService } from './scheduled-batch.service';

import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ClientsModule.register([
      {
        name: 'SCHEDULED_BATCH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'scheduled-batch',
            brokers: ['host.docker.internal:9092'],
          },
          consumer: {
            groupId: 'scheduled-batch-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [],
  providers: [ScheduledBatchService],
})
export class ScheduledBatchModule {}
