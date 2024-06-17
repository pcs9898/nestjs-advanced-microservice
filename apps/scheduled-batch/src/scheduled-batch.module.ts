import { Module } from '@nestjs/common';
import { ScheduledBatchController } from './scheduled-batch.controller';
import { ScheduledBatchService } from './scheduled-batch.service';

@Module({
  imports: [],
  controllers: [ScheduledBatchController],
  providers: [ScheduledBatchService],
})
export class ScheduledBatchModule {}
