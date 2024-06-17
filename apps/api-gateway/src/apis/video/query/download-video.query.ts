import { IQuery } from '@nestjs/cqrs';

export class DownloadVideoQuery implements IQuery {
  constructor(public readonly id: string) {}
}
