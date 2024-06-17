import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UploadVideoEvent } from './upload-video-event';
import { Logger } from '@nestjs/common';

@EventsHandler(UploadVideoEvent)
export class UploadVideoEventHandler
  implements IEventHandler<UploadVideoEvent>
{
  handle(event: UploadVideoEvent) {
    const { title } = event;

    Logger.log(`New Video: ${title} uploaded completely`);
  }
}
