import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ScheduledBatchService {
  constructor(private readonly userService: UserService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async removeUnVerifiedUserOver30Days() {
    Logger.log('removeUnVerifiedUserOver30Days called');
    await this.userService.removeUnVerifiedUserOver30Days();
  }
}
