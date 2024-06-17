import { Injectable } from '@nestjs/common';

@Injectable()
export class ScheduledBatchService {
  getHello(): string {
    return 'Hello World!';
  }
}
