import { ICommand } from '@nestjs/cqrs';
import { IVideoServiceCreateVideo } from '../interface/video-controller.interface';

export class UploadVideoCommand implements ICommand {
  constructor(public readonly data: IVideoServiceCreateVideo) {}
}
