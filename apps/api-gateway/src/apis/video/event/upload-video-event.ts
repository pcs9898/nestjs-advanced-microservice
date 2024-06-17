import { IEvent } from '@nestjs/cqrs';

export class UploadVideoEvent implements IEvent {
  constructor(public readonly title: string) {}
}
