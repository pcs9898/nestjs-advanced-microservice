import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entity/user.entity';

export class FindUserResDto {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  role: string;

  @ApiProperty({ required: true })
  created_at: string;

  static toDto({ id, email, role, createdAt: created_at }: User) {
    return {
      id,
      email,
      role: role.toString(),
      created_at: created_at.toISOString(),
    };
  }
}

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
