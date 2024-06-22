import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  RestoreAccessTokenResDto,
  SigninResDto,
  SignupResDto,
  VerifyAuthCodeResDto,
} from './dto/res.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorator/public.decorator';
import { ApiPostResponse } from 'src/common/decorator/swagger.decorator';
import {
  SigninReqDto,
  SignupReqDto,
  VerifyAuthCodeReqDto,
} from './dto/req.dto';
import { JwtUnVerifiedGuard } from './guard/jwt-un-verified.guard';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { IAuthUser, IBeforeAuthUser } from 'src/common/types/global-types';
import { Throttle } from '@nestjs/throttler';
import { JwtRefreshGuard } from './guard/jwt-refresh.guard';
import { CommandBus } from '@nestjs/cqrs';
import { SignUpCommand } from './command/sign-up.command';
import { VerifyAuthCodeCommand } from './command/verify-authCode.command';
import { SignInCommand } from './command/sign-in.command';
import { ResendAuthCodeCommand } from './command/resend-authCode.command';
import { RestoreAccessTokenCommand } from './command/restore-access-token.command';
import { SignOutCommand } from './command/sign-out.command';

// api v1 is normal, v2 is cqrs pattern implementation

@ApiTags('Auth')
@ApiExtraModels(
  SignupResDto,
  SigninResDto,
  RestoreAccessTokenResDto,
  VerifyAuthCodeResDto,
)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private commandBus: CommandBus,
  ) {}

  @Public()
  @ApiPostResponse(SignupResDto)
  @Post('signup/v1')
  async signupV1(@Body() data: SignupReqDto): Promise<SignupResDto> {
    return await this.authService.signup(data);
  }

  @Public()
  @ApiPostResponse(SignupResDto)
  @Post('signup/v2')
  async signupV2(@Body() data: SignupReqDto): Promise<SignupResDto> {
    return await this.commandBus.execute(new SignUpCommand(data));
  }

  @ApiBearerAuth()
  @UseGuards(JwtUnVerifiedGuard)
  @ApiPostResponse(VerifyAuthCodeResDto)
  @Post('verifyAuthCode/v1')
  async verifyAuthCodeV1(
    @GetUser() { id: userId, email }: IBeforeAuthUser,
    @Body() { authCode }: VerifyAuthCodeReqDto,
  ): Promise<VerifyAuthCodeResDto> {
    return await this.authService.verifyAuthCode({
      userId,
      email,
      authCode: authCode,
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtUnVerifiedGuard)
  @ApiPostResponse(VerifyAuthCodeResDto)
  @Post('verifyAuthCode/v2')
  async verifyAuthCodeV2(
    @GetUser() { id: userId, email }: IBeforeAuthUser,
    @Body() { authCode }: VerifyAuthCodeReqDto,
  ): Promise<VerifyAuthCodeResDto> {
    return await this.commandBus.execute(
      new VerifyAuthCodeCommand(userId, authCode, email),
    );
  }

  @Public()
  @ApiPostResponse(SigninResDto)
  @Throttle({ default: { limit: 3, ttl: 5000 } })
  @Post('signin/v1')
  async signInV1(@Body() data: SigninReqDto): Promise<SigninResDto> {
    return await this.authService.signin(data);
  }

  @Public()
  @ApiPostResponse(SigninResDto)
  @Throttle({ default: { limit: 3, ttl: 5000 } })
  @Post('signin/v2')
  async signInV2(@Body() data: SigninReqDto): Promise<SigninResDto> {
    return await this.commandBus.execute(new SignInCommand(data));
  }

  @ApiBearerAuth()
  @UseGuards(JwtUnVerifiedGuard)
  @ApiResponse({ status: 201, type: Boolean })
  @Post('resendAuthCode/v1')
  async resendAuthCodeV1(
    @GetUser() { id, email }: IBeforeAuthUser,
  ): Promise<boolean> {
    return await this.authService.resendAuthCode({ id, email });
  }

  @ApiBearerAuth()
  @UseGuards(JwtUnVerifiedGuard)
  @ApiResponse({ status: 201, type: Boolean })
  @Post('resendAuthCode/v2')
  async resendAuthCodeV2(
    @GetUser() { id, email }: IBeforeAuthUser,
  ): Promise<boolean> {
    return await this.commandBus.execute(new ResendAuthCodeCommand(id, email));
  }

  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @ApiPostResponse(RestoreAccessTokenResDto)
  @Post('restoreAccessToken/v1')
  async restoreAccessTokenV1(
    @Request() { refreshToken },
    @GetUser() { id }: IAuthUser,
  ): Promise<RestoreAccessTokenResDto> {
    return await this.authService.restoreAccessToken({
      userId: id,
      refreshToken,
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @ApiPostResponse(RestoreAccessTokenResDto)
  @Post('restoreAccessToken/v2')
  async restoreAccessTokenV2(
    @Request() { refreshToken },
    @GetUser() { id }: IAuthUser,
  ): Promise<RestoreAccessTokenResDto> {
    return await this.commandBus.execute(
      new RestoreAccessTokenCommand(refreshToken, id),
    );
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: Boolean })
  @Post('signout/v1')
  async signoutV1(@GetUser() { id }: IAuthUser): Promise<boolean> {
    return await this.authService.signout(id);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: Boolean })
  @Post('signout/v2')
  async signoutV2(@GetUser() { id }: IAuthUser): Promise<boolean> {
    return await this.commandBus.execute(new SignOutCommand(id));
  }
}
