import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DownloadVideoQuery } from './download-video.query';
import { VideoService } from '../video.service';

@QueryHandler(DownloadVideoQuery)
export class DownloadVideoHandler implements IQueryHandler<DownloadVideoQuery> {
  constructor(private readonly videoService: VideoService) {}

  async execute(query: DownloadVideoQuery) {
    const { id } = query;

    return await this.videoService.download({ id });
  }
}
