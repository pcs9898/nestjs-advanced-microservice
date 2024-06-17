import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneVideoQuery } from './findOne-video.handler';
import { VideoService } from '../video.service';

@QueryHandler(FindOneVideoQuery)
export class FindOneVideoHandler implements IQueryHandler<FindOneVideoQuery> {
  constructor(private readonly videoService: VideoService) {}

  async execute(query: FindOneVideoQuery) {
    const { id } = query;

    return await this.videoService.findOne({ id });
  }
}
