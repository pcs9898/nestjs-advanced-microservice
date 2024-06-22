import { Controller } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { CreateVideoResDto, FindVideoResDto } from './dto/res.dto';
import { DownloadVideoReqDto, FindVideoReqDto } from './dto/req.dto';
import { VideoService } from './video.service';
import { pageReqDto } from 'src/common/dto/req.dto';
import { PageResDto } from 'src/common/dto/res.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UploadVideoCommand } from './command/upload-video.command';
import { FindAllVideosQuery } from './query/findAll-videos.query';
import { FindOneVideoQuery } from './query/findOne-video.handler';

import { MessagePattern, Transport } from '@nestjs/microservices';
import { IVideoServiceCreateVideo } from './interface/video-controller.interface';
import { IVideoServiceDownloadVideoByIdRes } from './interface/video-service.interface';
import { DownloadVideoQuery } from './query/download-video.query';

@ApiTags('Video')
@ApiExtraModels(CreateVideoResDto, FindVideoResDto, FindVideoReqDto)
@Controller('video')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern({ cmd: 'createVideo' }, Transport.TCP)
  async createVideo(
    data: IVideoServiceCreateVideo,
  ): Promise<CreateVideoResDto> {
    const video = await this.commandBus.execute(new UploadVideoCommand(data));

    const result = CreateVideoResDto.toDto(video);

    return result;
  }

  @MessagePattern({ cmd: 'findAllVideos' }, Transport.TCP)
  async findAllVideos(data: pageReqDto): Promise<PageResDto<FindVideoResDto>> {
    const videos = await this.queryBus.execute(new FindAllVideosQuery(data));

    return {
      page: data.page,
      size: data.size,
      items: videos.map((v) => FindVideoResDto.toDto(v)),
    };
  }

  @MessagePattern({ cmd: 'findVideoById' }, Transport.TCP)
  async findVideoById(data: FindVideoReqDto): Promise<FindVideoResDto> {
    const video = await this.queryBus.execute(new FindOneVideoQuery(data.id));

    const response = FindVideoResDto.toDto(video);

    return response;
  }

  @MessagePattern({ cmd: 'downloadVideoById' })
  async downloadVideoById(
    data: DownloadVideoReqDto,
  ): Promise<IVideoServiceDownloadVideoByIdRes> {
    const result = await this.queryBus.execute(new DownloadVideoQuery(data.id));

    // console.log(result.stream);

    return result;
  }
}
