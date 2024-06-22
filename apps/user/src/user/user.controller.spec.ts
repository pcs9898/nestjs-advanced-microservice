// import { Test, TestingModule } from '@nestjs/testing';
// import { UserController } from './user.controller';
// import { UserService } from './user.service';
// import { pageReqDto } from 'src/common/dto/req.dto';
// import { FindUserReqDto } from './dto/req.dto';

// describe('UserController', () => {
//   let userController: UserController;
//   let userService: UserService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UserController],
//       providers: [
//         {
//           provide: UserService,
//           useValue: {
//             findAll: jest.fn(),
//             findOneById: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     userController = module.get<UserController>(UserController);
//     userService = module.get<UserService>(UserService);
//   });

//   it('should be defined', () => {
//     expect(userController).toBeDefined();
//   });

//   describe('findAllV1', () => {
//     it('should find all user', async () => {
//       // give
//       const users = [
//         {
//           id: 'f3fe9468-d1b8-4695-ae6e-c5bcd77f5072',
//           email: 'Garnet_Gusikowski@hotmail.com',
//           password: '4pLFDrbVsHJeQXF',
//           role: UserRole.Normal,
//           isVerified: false,
//           createdAt: new Date('2024-04-22T16:51:52.480Z'),
//           // updatedAt: new Date('2024-04-22T16:51:52.480Z'),
//           videos: [],
//         },
//         {
//           id: 'f817889b-a0b4-4951-840b-ccf9fcaae0af',
//           email: 'Meredith_Schmitt21@yahoo.com',
//           password: 'bzlw2jClHPfUrHS',
//           role: UserRole.Normal,
//           isVerified: false,
//           createdAt: new Date('2024-04-22T16:51:52.499Z'),
//           updatedAt: new Date('2024-04-22T16:51:52.499Z'),
//           videos: [],
//         },
//         {
//           id: '2d01b72b-3f51-414c-8ca8-d815875bef68',
//           email: 'Gerda_Herman@yahoo.com',
//           password: 'LvQQtnofAoL2TMZ',
//           role: UserRole.Normal,
//           isVerified: false,
//           createdAt: new Date('2024-04-22T16:51:52.499Z'),
//           updatedAt: new Date('2024-04-22T16:51:52.499Z'),
//           videos: [],
//         },
//       ];

//       const pageReqDto: pageReqDto = {
//         page: 1,
//         size: 3,
//       };

//       const result = {
//         page: 1,
//         size: 3,
//         items: [
//           {
//             id: 'f3fe9468-d1b8-4695-ae6e-c5bcd77f5072',
//             email: 'Garnet_Gusikowski@hotmail.com',
//             role: 'NORMAL',
//             created_at: '2024-04-22T16:51:52.480Z',
//           },
//           {
//             id: 'f817889b-a0b4-4951-840b-ccf9fcaae0af',
//             email: 'Meredith_Schmitt21@yahoo.com',
//             role: 'NORMAL',
//             created_at: '2024-04-22T16:51:52.499Z',
//           },
//           {
//             id: '2d01b72b-3f51-414c-8ca8-d815875bef68',
//             email: 'Gerda_Herman@yahoo.com',
//             role: 'NORMAL',
//             created_at: '2024-04-22T16:51:52.499Z',
//           },
//         ],
//       };

//       jest.spyOn(userService, 'findAll').mockResolvedValue(users);

//       // when, then
//       expect(await userController.findAllV1(pageReqDto)).toEqual(result);
//       expect(userService.findAll).toHaveBeenCalledWith(pageReqDto);
//     });
//   });

//   describe('findOneV1', () => {
//     it('should find one user', async () => {
//       //give
//       const findUserReqDto: FindUserReqDto = {
//         id: 'f3fe9468-d1b8-4695-ae6e-c5bcd77f5072',
//       };

//       const user = {
//         id: 'f3fe9468-d1b8-4695-ae6e-c5bcd77f5072',
//         email: 'Garnet_Gusikowski@hotmail.com',
//         password: '4pLFDrbVsHJeQXF',
//         role: UserRole.Normal,
//         isVerified: false,
//         createdAt: new Date('2024-04-22T16:51:52.480Z'),
//         updatedAt: new Date('2024-04-22T16:51:52.480Z'),
//         videos: [],
//       };

//       const result = {
//         id: 'f3fe9468-d1b8-4695-ae6e-c5bcd77f5072',
//         email: 'Garnet_Gusikowski@hotmail.com',
//         role: 'NORMAL',
//         created_at: '2024-04-22T16:51:52.480Z',
//       };

//       jest.spyOn(userService, 'findOneById').mockResolvedValue(user);

//       // when, then
//       expect(await userController.findOneV1(findUserReqDto)).toEqual(result);
//       expect(userService.findOneById).toHaveBeenCalledWith(findUserReqDto);
//     });
//   });
// });
