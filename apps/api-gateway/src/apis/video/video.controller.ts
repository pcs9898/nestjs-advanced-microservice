import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiExtraModels,
  ApiTags,
} from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { Response } from 'express';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { Public } from 'src/common/decorator/public.decorator';
import {
  ApiGetItemResponse,
  ApiPostResponse,
} from 'src/common/decorator/swagger.decorator';
import { pageReqDto } from 'src/common/dto/req.dto';
import { PageResDto } from 'src/common/dto/res.dto';
import { IAuthUser } from 'src/common/types/global-types';
import { UploadVideoCommand } from './command/upload-video.command';
import {
  CreateVideoReqDto,
  DownloadVideoReqDto,
  FindVideoReqDto,
} from './dto/req.dto';
import { CreateVideoResDto, FindVideoResDto } from './dto/res.dto';
import { FindAllVideosQuery } from './query/findAll-videos.query';
import { FindOneVideoQuery } from './query/findOne-video.handler';
import { VideoService } from './video.service';
import { ReadStream } from 'fs';
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

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiPostResponse(CreateVideoResDto)
  @Post('upload/v1')
  @UseInterceptors(FileInterceptor('video'))
  async createVideoV1(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'mp4' })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024,
        })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
    @Body() { title }: CreateVideoReqDto,
    @GetUser() user: IAuthUser,
  ): Promise<CreateVideoResDto> {
    return await this.videoService.createVideo({ file, title, user });
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiPostResponse(CreateVideoResDto)
  @Post('upload/v2')
  @UseInterceptors(FileInterceptor('video'))
  async createVideoV2(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'mp4' })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024,
        })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
    @Body() { title }: CreateVideoReqDto,
    @GetUser() user: IAuthUser,
  ): Promise<CreateVideoResDto> {
    return await this.commandBus.execute(
      new UploadVideoCommand(file, title, user),
    );
  }

  @Public()
  @ApiGetItemResponse(FindVideoResDto)
  @SkipThrottle()
  @Get('v1')
  async findAllVideosV1(
    @Query() data: pageReqDto,
  ): Promise<PageResDto<FindVideoResDto>> {
    return await this.videoService.findAllVideos(data);
  }

  @Public()
  @ApiGetItemResponse(FindVideoResDto)
  @SkipThrottle()
  @Get('v2')
  async findAllVideosV2(
    @Query() data: pageReqDto,
  ): Promise<PageResDto<FindVideoResDto>> {
    return await this.queryBus.execute(new FindAllVideosQuery(data));
  }

  @Public()
  @ApiGetItemResponse(FindVideoResDto)
  @SkipThrottle()
  @Get(':id/v1')
  async findOneV1(@Query() { id }: FindVideoReqDto): Promise<FindVideoResDto> {
    return await this.videoService.findVideoById({ id });
  }

  @Public()
  @ApiGetItemResponse(FindVideoResDto)
  @SkipThrottle()
  @Get(':id/v2')
  async findOneV2(@Query() { id }: FindVideoReqDto): Promise<FindVideoResDto> {
    return await this.queryBus.execute(new FindOneVideoQuery(id));
  }

  @ApiBearerAuth()
  @Get(':id/download/v1')
  async downloadV1(
    @Param() { id }: DownloadVideoReqDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { mimetype, buffer, size } =
      await this.videoService.downloadVideoById({ id });

    const stream = ReadStream.from(Buffer.from(buffer.data));

    res.set({
      'Content-Type': mimetype,
      'Content-Length': size,
      'Content-Disposition': 'attachment',
    });

    return new StreamableFile(stream);
  }

  @ApiBearerAuth()
  @Get(':id/download/v2')
  async downloadV2(
    @Param() { id }: DownloadVideoReqDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { mimetype, buffer, size } = await this.queryBus.execute(
      new DownloadVideoQuery(id),
    );

    const stream = ReadStream.from(Buffer.from(buffer.data));

    res.set({
      'Content-Type': mimetype,
      'Content-Length': size,
      'Content-Disposition': 'attachment',
    });

    return new StreamableFile(stream);
  }
}
