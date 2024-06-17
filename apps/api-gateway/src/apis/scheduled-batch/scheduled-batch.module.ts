import { Module } from '@nestjs/common';
import { ScheduledBatchService } from './scheduled-batch.service';
import { UserModule } from '../user/user.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), UserModule],
  providers: [ScheduledBatchService],
})
export class ScheduledBatchModule {}
