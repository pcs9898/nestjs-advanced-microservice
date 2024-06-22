import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { readFile, stat } from 'fs/promises';
import { writeFile } from 'node:fs/promises';
import { join } from 'path';
import { firstValueFrom } from 'rxjs';
import { pageReqDto } from 'src/common/dto/req.dto';
import { IAuthUser } from 'src/common/types/global-types';
import { DataSource, Repository } from 'typeorm';
import { DownloadVideoReqDto, FindVideoReqDto } from './dto/req.dto';
import { Video } from './entity/video.entity';
import { IVideoServiceDownloadVideoByIdRes } from './interface/video-service.interface';

interface IVideoServiceCreateVideo {
  user: IAuthUser;
  title: string;
  file: Express.Multer.File;
}

interface IVideoServiceUploadVideo {
  id: string;
  extension: string;
  buffer: Buffer;
}

@Injectable()
export class VideoService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Video) private videoRepository: Repository<Video>,
    @Inject('USER_SERVICE') private userClient: ClientProxy,
  ) {}

  async createVideo({ file, title, user }: IVideoServiceCreateVideo) {
    const { mimetype, originalname, buffer: changedBuffer } = file;
    const buffer = Buffer.from(changedBuffer);

    const extension = originalname.split('.')[1];

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const foundVideo = await queryRunner.manager.findOne(Video, {
        where: { title },
      });
      if (foundVideo) throw new ConflictException('Title already exists');

      const video = await queryRunner.manager.save(
        this.videoRepository.create({ title, mimetype, userId: user.id }),
      );

      await this.uploadVideo({ id: video.id, extension, buffer });

      await queryRunner.commitTransaction();

      return video;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error during video creation', error);

      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Error during video creation',
          error.message,
        );
      }
    } finally {
      await queryRunner.release();
    }
  }

  private async uploadVideo({
    id,
    extension,
    buffer,
  }: IVideoServiceUploadVideo) {
    const filePath = join(process.cwd(), 'video-storage', `${id}.${extension}`);

    try {
      await writeFile(filePath, buffer);
    } catch (error) {
      console.error('Error during upload video', error);
      throw new InternalServerErrorException(
        'Error during upload video',
        error.message,
      );
    }
  }

  async findAllVideos({ page, size }: pageReqDto): Promise<Video[]> {
    const videos = await this.videoRepository.find({
      skip: (page - 1) * size,
      take: size,
    });

    const videosWithUser = await Promise.all(
      videos.map(async (video) => {
        const userInfo = await firstValueFrom(
          this.userClient.send({ cmd: 'findUserById' }, { id: video.userId }),
        );
        return { ...video, user: userInfo };
      }),
    );

    return videosWithUser;
  }

  async findVideoById({ id }: FindVideoReqDto) {
    const video = await this.videoRepository.findOne({
      where: { id },
    });

    if (!video) throw new NotFoundException('Video not found');

    const user = await firstValueFrom(
      this.userClient.send({ cmd: 'findUserById' }, { id: video.userId }),
    );

    const videoWithUser = { ...video, user };

    return videoWithUser;
  }

  async downloadVideoById({
    id,
  }: DownloadVideoReqDto): Promise<IVideoServiceDownloadVideoByIdRes> {
    const video = await this.videoRepository.findOneBy({ id });
    if (!video) throw new NotFoundException('Video not found');

    await this.videoRepository.update(
      { id },
      { downloadCnt: () => 'download_cnt+1' },
    );

    const { mimetype } = video;
    const extension = mimetype.split('/')[1];
    const videoPath = join(
      process.cwd(),
      'video-storage',
      `${id}.${extension}`,
    );

    const { size } = await stat(videoPath);
    const buffer = await readFile(videoPath);

    return {
      buffer,
      mimetype,
      size,
    };
  }

  async findTop5DownloadVideos(): Promise<Video[]> {
    const videos = await this.videoRepository.find({
      order: {
        downloadCnt: 'DESC',
      },
      take: 5,
    });

    return videos;
  }
}
