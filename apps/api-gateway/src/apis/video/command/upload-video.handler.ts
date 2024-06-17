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
    const { file, title, user } = command;

    const video = await this.videoService.create({ file, title, user });

    this.eventBus.publish(new UploadVideoEvent(title));

    return video;
  }
}
