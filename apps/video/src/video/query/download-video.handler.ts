import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DownloadVideoQuery } from './download-video.query';
import { VideoService } from '../video.service';
import { IVideoServiceDownloadVideoByIdRes } from '../interface/video-service.interface';

@QueryHandler(DownloadVideoQuery)
export class DownloadVideoHandler implements IQueryHandler<DownloadVideoQuery> {
  constructor(private readonly videoService: VideoService) {}

  async execute(
    query: DownloadVideoQuery,
  ): Promise<IVideoServiceDownloadVideoByIdRes> {
    const { id } = query;

    return await this.videoService.downloadVideoById({ id });
  }
}
