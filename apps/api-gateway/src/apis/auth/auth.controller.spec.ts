// import { Test } from '@nestjs/testing';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import {
//   RestoreAccessTokenResDto,
//   SigninResDto,
//   SignupResDto,
//   VerifyAuthCodeResDto,
// } from './dto/res.dto';
// import {
//   SigninReqDto,
//   SignupReqDto,
//   VerifyAuthCodeReqDto,
// } from './dto/req.dto';
// import { Logger } from '@nestjs/common';

// describe('AuthController', () => {
//   let authController: AuthController;
//   let authService: AuthService;

//   beforeEach(async () => {
//     const module = await Test.createTestingModule({
//       controllers: [AuthController],
//       providers: [
//         {
//           provide: AuthService,
//           useValue: {
//             signup: jest.fn(),
//             verifyAuthCode: jest.fn(),
//             resendAuthCode: jest.fn(),
//             signin: jest.fn(),
//             restoreAccessToken: jest.fn(),
//             signout: jest.fn(),
//           },
//         },
//         Logger,
//       ],
//     }).compile();

//     authController = module.get(AuthController);
//     authService = module.get(AuthService);
//   });

//   it('should be defined', () => {
//     expect(authController).toBeDefined();
//   });

//   describe('signupV1', () => {
//     it('should sign up a user', async () => {
//       // give
//       const signupReqDto: SignupReqDto = {
//         email: 'test@example.com',
//         password: 'password',
//         passwordConfirm: 'password',
//       };
//       const signupResDto: SignupResDto = {
//         id: 'test',
//         unVerifiedToken: 'unVerifiedToken',
//       };

//       jest.spyOn(authService, 'signup').mockResolvedValue(signupResDto);

//       // when, then
//       expect(await authController.signupV1(signupReqDto)).toEqual(signupResDto);
//       expect(authService.signup).toHaveBeenCalledWith(signupReqDto);
//     });
//   });

//   describe('verifyAuthCodeV1', () => {
//     it('should verify auth code', async () => {
//       // give
//       const verifyAuthCodeReqDto: VerifyAuthCodeReqDto = {
//         authCode: '123456',
//       };

//       const verifyAuthCodeResDto: VerifyAuthCodeResDto = {
//         accessToken: 'accessToken',
//         refreshToken: 'refreshToken',
//       };

//       jest
//         .spyOn(authService, 'verifyAuthCode')
//         .mockResolvedValue(verifyAuthCodeResDto);

//       // when, then
//       expect(
//         await authController.verifyAuthCodeV1(
//           { id: '123' },
//           verifyAuthCodeReqDto,
//         ),
//       ).toEqual(verifyAuthCodeResDto);
//       expect(authService.verifyAuthCode).toHaveBeenCalledWith({
//         userId: '123',
//         authCode: Number(verifyAuthCodeReqDto.authCode),
//       });
//     });
//   });

//   describe('resendAuthCodeV1', () => {
//     it('should resend auth code', async () => {
//       // give
//       const userId = '123';

//       const response = true;

//       jest.spyOn(authService, 'resendAuthCode').mockResolvedValue(response);

//       // when, then
//       expect(await authController.resendAuthCodeV1({ id: userId })).toEqual(
//         response,
//       );
//       expect(authService.resendAuthCode).toHaveBeenCalledWith(userId);
//     });
//   });

//   describe('signinV1', () => {
//     it('should sign in a user, ', async () => {
//       // give
//       const signinReqDto: SigninReqDto = {
//         email: 'test@example.com',
//         password: 'password',
//       };

//       const signinResDto: SigninResDto = {
//         accessToken: 'access-token',
//         refreshToken: 'refresh-token',
//       };

//       jest.spyOn(authService, 'signin').mockResolvedValue(signinResDto);

//       // when, then
//       expect(await authController.signInV1(signinReqDto)).toEqual(signinResDto);
//       expect(authService.signin).toHaveBeenCalledWith(signinReqDto);
//     });
//   });

//   describe('restoreAccessTokenV1', () => {
//     it('should restore the access token', async () => {
//       // give
//       const userId = '1234';
//       const refreshTokenObj = {
//         refreshToken: 'refreshToken',
//       };

//       const restoreAccessTokenResDto: RestoreAccessTokenResDto = {
//         accessToken: 'accessToken',
//         refreshToken: 'refreshToken',
//       };

//       jest
//         .spyOn(authService, 'restoreAccessToken')
//         .mockResolvedValue(restoreAccessTokenResDto);

//       // when, then
//       expect(
//         await authController.restoreAccessTokenV1(refreshTokenObj, {
//           id: userId,
//         }),
//       ).toEqual(restoreAccessTokenResDto);
//       expect(authService.restoreAccessToken).toHaveBeenCalledWith({
//         userId,
//         ...refreshTokenObj,
//       });
//     });
//   });

//   describe('signoutV1', () => {
//     it('should sign out a user', async () => {
//       // give
//       const userId = '1234';
//       const response = true;

//       jest.spyOn(authService, 'signout').mockResolvedValue(response);

//       // when, then
//       expect(await authController.signout({ id: userId })).toEqual(response);
//       expect(authService.signout).toHaveBeenCalledWith(userId);
//     });
//   });
// });
