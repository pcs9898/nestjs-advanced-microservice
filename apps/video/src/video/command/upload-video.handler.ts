import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UploadVideoCommand } from './upload-video.command';
import { Video } from '../entity/video.entity';
import { VideoService } from '../video.service';
import { UploadVideoEvent } from '../event/upload-video-event';

@CommandHandler(UploadVideoCommand)
export class UploadVideoHandler implements ICommandHandler<UploadVideoCommand> {
  constructor(
    private readonly videoService: VideoService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UploadVideoCommand): Promise<Video> {
    const { data } = command;

    const video = await this.videoService.createVideo(data);

    this.eventBus.publish(new UploadVideoEvent(data.title));

    return video;
  }
}
