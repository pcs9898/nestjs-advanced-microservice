import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entity/video.entity';
import { MulterExceptionFilter } from './filter/multer-exception.filter';
import { CqrsModule } from '@nestjs/cqrs';
import { UploadVideoHandler } from './command/upload-video.handler';
import { UploadVideoEventHandler } from './event/upload-video-event.handler';
import { FindAllVideosHandler } from './query/findAll-videos.handler';
import { FindOneVideoHandler } from './query/findOne-video.query';
import { DownloadVideoHandler } from './query/download-video.handler';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [TypeOrmModule.forFeature([Video]), CqrsModule],
  controllers: [VideoController],
  providers: [
    VideoService,
    MulterExceptionFilter,
    UploadVideoHandler,
    UploadVideoEventHandler,
    FindAllVideosHandler,
    FindOneVideoHandler,
    DownloadVideoHandler,
    {
      provide: 'USER_SERVICE',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: 'user-service',
            port: 3001,
          },
        });
      },
    },
  ],
  exports: [VideoService],
})
export class VideoModule {}
