import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject('VIDEO_SERVICE') private videoTcpClient: ClientProxy,
    @Inject('MAIL_SERVICE') private mailKafkaClient: ClientProxy,
  ) {}

  @Cron(CronExpression.EVERY_10_HOURS)
  async findTop5DownloadVideos() {
    Logger.log('findTop5DownloadVideos called');
    const videos = await firstValueFrom(
      this.videoTcpClient.send({ cmd: 'findTop5DownloadVideos' }, {}),
    );
    console.log(videos);

    this.mailKafkaClient.emit('sendFindTop5downloadVideos', videos);
  }
}
