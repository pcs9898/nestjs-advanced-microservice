// import { Test, TestingModule } from '@nestjs/testing';
// import { MailService } from './mail.service';
// import { MAILER_OPTIONS, MailerService } from '@nestjs-modules/mailer';
// import { ConfigService } from '@nestjs/config';
// import { createTransport } from 'nodemailer';
// import { UserRole } from 'src/common/enum/global-enum';

// describe('MailService', () => {
//   let mailService: MailService;
//   let mailerService: MailerService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         MailService,
//         {
//           provide: MailerService,
//           useValue: {
//             sendMail: jest.fn().mockResolvedValue({}),
//           },
//         },
//         {
//           provide: MAILER_OPTIONS,
//           useValue: {
//             transport: createTransport({
//               host: 'smtp.example.com',
//               port: 587,
//               secure: false,
//               auth: {
//                 user: 'admin',
//               },
//             }),
//           },
//         },
//         {
//           provide: ConfigService,
//           useValue: {
//             get: jest.fn().mockImplementation((key: string) => {
//               switch (key) {
//                 case 'mail.senderEmail':
//                   return 'sender@example.com';
//                 default:
//                   return null;
//               }
//             }),
//           },
//         },
//       ],
//     }).compile();

//     mailService = module.get<MailService>(MailService);
//     mailerService = module.get<MailerService>(MailerService);
//   });

//   it('should be defined', () => {
//     expect(mailService).toBeDefined();
//   });

//   it('should Send Auth Code', async () => {
//     // give
//     const authCode = 123456;
//     const email = 'email@example.com';
//     const username = email.split('@')[0];
//     const senderEmail = 'sender@example.com';

//     jest
//       .spyOn(mailerService, 'sendMail')
//       .mockImplementation(() => Promise.resolve());

//     // when, then
//     expect(
//       mailService.sendAuthCode({ authCode, email }),
//     ).resolves.not.toThrow();
//     expect(mailerService.sendMail).toHaveBeenCalledWith({
//       to: email,
//       from: senderEmail,
//       html: expect.any(String),
//       subject: `Hello ${username}`,
//     });
//   });

//   it('should send find top 5 download videos', async () => {
//     // give
//     const testVideos = [
//       {
//         id: '1231deda',
//         title: 'hiihi',
//         createdAt: new Date(),
//         downloadCnt: 1,
//         mimetype: 'mp4',
//         updatedAt: new Date(),
//         user: {
//           id: '12312312',
//           email: 'oihaodas',
//           password: 'oiahsoda',
//           role: UserRole.Admin,
//           isVerified: true,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//           videos: [],
//         },
//       },
//       {
//         id: '1231deda',
//         title: 'hiihi2',
//         createdAt: new Date(),
//         downloadCnt: 1,
//         mimetype: 'mp4',
//         updatedAt: new Date(),
//         user: {
//           id: '12312312',
//           email: 'oihaodas',
//           password: 'oiahsoda',
//           role: UserRole.Admin,
//           isVerified: true,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//           videos: [],
//         },
//       },
//     ];
//     const receiverEmail = 'sender@example.com';
//     const senderEmail = 'nesttube@nesttube.com';

//     jest
//       .spyOn(mailerService, 'sendMail')
//       .mockImplementation(() => Promise.resolve());

//     // when, then
//     expect(
//       mailService.sendFindTop5downloadVideos(testVideos),
//     ).resolves.not.toThrow();
//     expect(mailerService.sendMail).toHaveBeenCalledWith({
//       to: receiverEmail,
//       from: senderEmail,
//       subject: 'Top 5 downloaded Videos by Nest Tube',
//       html: expect.any(String),
//     });

//     // Check that the email body contains the titles of the videos
//     for (const video of testVideos) {
//       expect(mailerService.sendMail).toHaveBeenCalledWith(
//         expect.objectContaining({
//           html: expect.stringContaining(video.title),
//         }),
//       );
//     }
//   });
// });
