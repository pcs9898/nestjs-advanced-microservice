import { Test, TestingModule } from '@nestjs/testing';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { Video } from './entity/video.entity';
import { User } from '../user/entity/user.entity';
import { UserRole } from 'src/common/enum/global-enum';
import { pageReqDto } from 'src/common/dto/req.dto';
import { FindVideoResDto } from './dto/res.dto';
import { INestApplication, StreamableFile } from '@nestjs/common';
import * as mockFs from 'mock-fs';
import * as fs from 'fs';
import { mock, MockProxy } from 'jest-mock-extended';
import { Response } from 'express';

describe('VideoController', () => {
  let videoController: VideoController;
  let videoService: VideoService;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoController],
      providers: [
        {
          provide: VideoService,
          useValue: {
            create: jest.fn(),
            uploadVideo: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            download: jest.fn(),
            findTop5DownloadVideos: jest.fn(),
          },
        },
      ],
    }).compile();

    videoController = module.get<VideoController>(VideoController);
    videoService = module.get<VideoService>(VideoService);
    app = module.createNestApplication();
    await app.init();
  });

  beforeAll(() => {
    // Mock the file system
    mockFs({
      'video-storage': {
        '35bb989f-2d4b-4c27-b789-a7ee0c3b04c3.mp4': 'file content',
      },
    });
  });

  afterEach(async () => {
    await app.close();
  });

  afterAll(() => {
    // Restore the file system
    mockFs.restore();
  });

  it('should be defined', () => {
    expect(videoController).toBeDefined();
  });

  describe('uploadV1', () => {
    it('should upload video', async () => {
      // given
      const file: Express.Multer.File = {
        fieldname: 'video',
        originalname: 'video.mp4',
        encoding: '7bit',
        mimetype: 'video/mp4',
        buffer: Buffer.from('video'),
        size: 1024,
        stream: null,
        destination: '',
        filename: '',
        path: '',
      };

      const title = 'video';

      const user: User = {
        id: 'user-id',
        email: '',
        password: '',
        role: UserRole.Normal,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        videos: [],
      };

      const video: Video = {
        title: 'video',
        mimetype: 'video/mp4',
        user: {
          id: 'user-id',
          email: '',
          password: '',
          role: UserRole.Normal,
          isVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          videos: [],
          // Add any other required properties of the User type
        },
        id: '35bb989f-2d4b-4c27-b789-a7ee0c3b04c3',
        downloadCnt: 0,
        createdAt: new Date('2024-06-13T13:01:30.386Z'),
        updatedAt: new Date('2024-06-13T13:01:30.386Z'),
      };

      const response = {
        id: '35bb989f-2d4b-4c27-b789-a7ee0c3b04c3',
        title: 'video',
      };

      jest.spyOn(videoService, 'create').mockResolvedValue(video);

      // when, then
      expect(
        await videoController.uploadV1(file, { title, video }, user),
      ).toEqual(response);
      expect(videoService.create).toHaveBeenCalledWith({ file, title, user });
    });
  });

  describe('findAllV1', () => {
    it('should find all videos', async () => {
      // give
      const data: pageReqDto = {
        page: 1,
        size: 3,
      };

      const videos = [
        {
          id: '35bb989f-2d4b-4c27-b789-a7ee0c3b04c3',
          title: 'heelo2',
          mimetype: 'video/mp4',
          downloadCnt: 0,
          createdAt: new Date('2024-06-13T13:01:30.386Z'),
          updatedAt: new Date('2024-06-13T13:01:30.386Z'),
          user: {
            id: '0c72982c-1902-465e-8157-d60d64c8fc33',
            email: 'aa@a.com',
            password:
              '$2b$10$etriFd1Rj/1dAYhO4J8Puu3xIQdcnh7apY80MFS7IaL0Ok1gB7aWe',
            role: UserRole.Normal,
            isVerified: true,
            createdAt: new Date('2024-05-09T02:52:09.705Z'),
            updatedAt: new Date('2024-05-09T03:10:14.857Z'),
            videos: [],
          },
        },
        {
          id: '411a0929-0d8f-4769-9fb6-12edd94564cc',
          title: 'heelo1',
          mimetype: 'video/mp4',
          downloadCnt: 1,
          createdAt: new Date('2024-06-13T12:27:29.505Z'),
          updatedAt: new Date('2024-06-13T12:27:53.704Z'),
          user: {
            id: '0c72982c-1902-465e-8157-d60d64c8fc33',
            email: 'aa@a.com',
            password:
              '$2b$10$etriFd1Rj/1dAYhO4J8Puu3xIQdcnh7apY80MFS7IaL0Ok1gB7aWe',
            role: UserRole.Normal,
            isVerified: true,
            createdAt: new Date('2024-05-09T02:52:09.705Z'),
            updatedAt: new Date('2024-05-09T03:10:14.857Z'),
            videos: [],
          },
        },
      ];

      const response = {
        page: 1,
        size: 3,
        items: [
          {
            id: '35bb989f-2d4b-4c27-b789-a7ee0c3b04c3',
            title: 'heelo2',
            user: {
              user_id: '0c72982c-1902-465e-8157-d60d64c8fc33',
              email: 'aa@a.com',
            },
          },
          {
            id: '411a0929-0d8f-4769-9fb6-12edd94564cc',
            title: 'heelo1',
            user: {
              user_id: '0c72982c-1902-465e-8157-d60d64c8fc33',
              email: 'aa@a.com',
            },
          },
        ],
      };

      jest.spyOn(videoService, 'findAll').mockResolvedValue(videos);

      // when, then
      expect(await videoController.findAllV1(data)).toEqual(response);
      expect(videoService.findAll).toHaveBeenCalledWith(data);
    });
  });

  describe('findOneV1', () => {
    it('should find one video', async () => {
      // give
      const id = '35bb989f-2d4b-4c27-b789-a7ee0c3b04c3';

      const video = {
        id: '35bb989f-2d4b-4c27-b789-a7ee0c3b04c3',
        title: 'heelo2',
        mimetype: 'video/mp4',
        downloadCnt: 0,
        createdAt: new Date('2024-06-13T13:01:30.386Z'),
        updatedAt: new Date('2024-06-13T13:01:30.386Z'),
        user: {
          id: '0c72982c-1902-465e-8157-d60d64c8fc33',
          email: 'aa@a.com',
          password:
            '$2b$10$etriFd1Rj/1dAYhO4J8Puu3xIQdcnh7apY80MFS7IaL0Ok1gB7aWe',
          role: UserRole.Normal,
          isVerified: true,
          createdAt: new Date('2024-05-09T02:52:09.705Z'),
          updatedAt: new Date('2024-05-09T03:10:14.857Z'),
          videos: [],
        },
      };

      const response = FindVideoResDto.toDto(video);

      jest.spyOn(videoService, 'findOne').mockResolvedValue(video);

      // when, then
      expect(await videoController.findOneV1({ id })).toEqual(response);
      expect(videoService.findOne).toHaveBeenCalledWith({ id });
    });
  });

  describe('downloadV1', () => {
    it('should download video', async () => {
      // give
      const id = '35bb989f-2d4b-4c27-b789-a7ee0c3b04c3';

      const serviceResponse = {
        mimetype: 'video/mp4',
        stream: fs.createReadStream(
          'video-storage/35bb989f-2d4b-4c27-b789-a7ee0c3b04c3.mp4',
        ),
        size: 1000,
      };

      jest.spyOn(videoService, 'download').mockResolvedValue(serviceResponse);

      let res: MockProxy<Response> & Response;
      res = mock<Response>();

      // when, then
      const response = await videoController.downloadV1({ id }, res);
      expect(response).toBeInstanceOf(StreamableFile);
      expect(videoService.download).toHaveBeenCalledWith({ id });
    });
  });
});
