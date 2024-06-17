import { MailService } from './../mail/mail.service';
import { Injectable, Logger } from '@nestjs/common';
import { VideoService } from '../video/video.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly videoService: VideoService,
    private readonly mailService: MailService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_10PM)
  async findTop5DownloadVideos() {
    Logger.log('findTop5DownloadVideos called');
    const videos = await this.videoService.findTop5DownloadVideos();

    await this.mailService.sendFindTop5downloadVideos(videos);
  }
}
