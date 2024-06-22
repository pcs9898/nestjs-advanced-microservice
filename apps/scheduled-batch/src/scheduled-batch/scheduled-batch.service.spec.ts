// import { Test, TestingModule } from '@nestjs/testing';
// import { ScheduledBatchService } from './scheduled-batch.service';
// import { UserService } from '../user/user.service';

// describe('ScheduledBatchService', () => {
//   let scheduledBatchService: ScheduledBatchService;
//   let userService: UserService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         ScheduledBatchService,
//         {
//           provide: UserService,
//           useValue: {
//             removeUnVerifiedUserOver30Days: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     scheduledBatchService = module.get<ScheduledBatchService>(
//       ScheduledBatchService,
//     );
//     userService = module.get<UserService>(UserService);
//   });

//   it('should be defined', () => {
//     expect(scheduledBatchService).toBeDefined();
//   });

//   describe('removeUnVerifiedUserOver30Days', () => {
//     it('should call removeUnVerifiedUserOver30Days', async () => {
//       // give

//       // when, then
//       await scheduledBatchService.removeUnVerifiedUserOver30Days();
//       expect(userService.removeUnVerifiedUserOver30Days).toHaveBeenCalled();
//     });
//   });
// });
