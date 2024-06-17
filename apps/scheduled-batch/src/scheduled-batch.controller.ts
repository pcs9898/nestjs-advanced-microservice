import { Controller, Get } from '@nestjs/common';
import { ScheduledBatchService } from './scheduled-batch.service';

@Controller()
export class ScheduledBatchController {
  constructor(private readonly scheduledBatchService: ScheduledBatchService) {}

  @Get()
  getHello(): string {
    return this.scheduledBatchService.getHello();
  }
}
