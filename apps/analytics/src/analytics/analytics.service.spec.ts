// import { Test, TestingModule } from '@nestjs/testing';
// import { AnalyticsService } from './analytics.service';
// import { MailService } from '../mail/mail.service';
// import { VideoService } from '../video/video.service';
// import { UserRole } from 'src/common/enum/global-enum';

// describe('AnalyticsService', () => {
//   let analyticsService: AnalyticsService;
//   let mailService: MailService;
//   let videoService: VideoService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AnalyticsService,
//         {
//           provide: VideoService,
//           useValue: { findTop5DownloadVideos: jest.fn() },
//         },
//         {
//           provide: MailService,
//           useValue: { sendFindTop5downloadVideos: jest.fn() },
//         },
//       ],
//     }).compile();

//     analyticsService = module.get<AnalyticsService>(AnalyticsService);
//     mailService = module.get<MailService>(MailService);
//     videoService = module.get<VideoService>(VideoService);
//   });

//   it('should be defined', () => {
//     expect(analyticsService).toBeDefined();
//   });

//   describe('findTop5DownloadVideos', () => {
//     it('should find Top 5 Download Videos', async () => {
//       // give
//       const videos = [
//         {
//           id: '1231deda',
//           title: 'hiihi',
//           createdAt: new Date(),
//           downloadCnt: 3,
//           mimetype: 'mp4',
//           updatedAt: new Date(),
//           user: {
//             id: '12312312',
//             email: 'oihaodas',
//             password: 'oiahsoda',
//             role: UserRole.Admin,
//             isVerified: true,
//             createdAt: new Date(),
//             updatedAt: new Date(),
//             videos: [],
//           },
//         },
//         {
//           id: '1231de123da',
//           title: 'hiihi4',
//           createdAt: new Date(),
//           downloadCnt: 10,
//           mimetype: 'mp4',
//           updatedAt: new Date(),
//           user: {
//             id: '12312312',
//             email: 'oihaodas',
//             password: 'oiahsoda',
//             role: UserRole.Admin,
//             isVerified: true,
//             createdAt: new Date(),
//             updatedAt: new Date(),
//             videos: [],
//           },
//         },
//       ];

//       jest
//         .spyOn(videoService, 'findTop5DownloadVideos')
//         .mockResolvedValue(videos);

//       // when, then
//       expect(analyticsService.findTop5DownloadVideos()).resolves.not.toThrow();
//       expect(await mailService.sendFindTop5downloadVideos).toHaveBeenCalledWith(
//         videos,
//       );
//     });
//   });
// });
