import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ScheduledBatchService {
  constructor(
    @Inject('SCHEDULED_BATCH_SERVICE') private kafkaClient: ClientKafka,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async removeUnVerifiedUserOver30Days() {
    Logger.log('removeUnVerifiedUserOver30Days called');
    this.kafkaClient.emit('removeUnVerifiedUserOver30Days', { id: 'hi' });
  }
}
