import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllVideosQuery } from './findAll-videos.query';
import { VideoService } from '../video.service';

@QueryHandler(FindAllVideosQuery)
export class FindAllVideosHandler implements IQueryHandler<FindAllVideosQuery> {
  constructor(private readonly videoService: VideoService) {}

  async execute(query: FindAllVideosQuery) {
    const { data } = query;

    return await this.videoService.findAll(data);
  }
}
