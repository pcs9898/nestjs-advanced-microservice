import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { pageReqDto } from 'src/common/dto/req.dto';
import { PageResDto } from 'src/common/dto/res.dto';
import { DownloadVideoReqDto, FindVideoReqDto } from './dto/req.dto';
import { CreateVideoResDto, FindVideoResDto } from './dto/res.dto';
import {
  IVideoServiceCreateVideo,
  IVideoServiceDownloadVideoByIdRes,
} from './interface/video-service.interface';

@Injectable()
export class VideoService {
  constructor(@Inject('VIDEO_SERVICE') private videoClient: ClientProxy) {}

  async createVideo(data: IVideoServiceCreateVideo) {
    return await firstValueFrom<CreateVideoResDto>(
      this.videoClient.send<CreateVideoResDto>({ cmd: 'createVideo' }, data),
    );
  }

  async findAllVideos(data: pageReqDto) {
    return await firstValueFrom<PageResDto<FindVideoResDto>>(
      this.videoClient.send({ cmd: 'findAllVideos' }, data),
    );
  }

  async findVideoById({ id }: FindVideoReqDto) {
    return await firstValueFrom<FindVideoResDto>(
      this.videoClient.send({ cmd: 'findVideoById' }, { id }),
    );
  }

  async downloadVideoById({
    id,
  }: DownloadVideoReqDto): Promise<IVideoServiceDownloadVideoByIdRes> {
    return await firstValueFrom(
      this.videoClient.send({ cmd: 'downloadVideoById' }, { id }),
    );
  }

  // async findTop5DownloadVideos() {
  //   const videos = await this.videoRepository.find({
  //     relations: ['user'],
  //     order: {
  //       downloadCnt: 'DESC',
  //     },
  //     take: 5,
  //   });

  //   return videos;
  // }
}
