import { ApiProperty } from '@nestjs/swagger';

export class SignupResDto {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  unVerifiedToken: string;
}

export class SigninResDto {
  @ApiProperty({})
  accessToken?: string;

  @ApiProperty({})
  refreshToken?: string;

  @ApiProperty({})
  unVerifiedToken?: string;
}

export class RestoreAccessTokenResDto {
  @ApiProperty({ required: true })
  accessToken: string;

  @ApiProperty({ required: true })
  refreshToken: string;
}

export class VerifyAuthCodeResDto {
  @ApiProperty({ required: true })
  accessToken: string;

  @ApiProperty({ required: true })
  refreshToken: string;
}
