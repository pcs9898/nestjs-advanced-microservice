import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MinLength } from 'class-validator';

export class SignupReqDto {
  @ApiProperty({ required: true, example: 'aa@a.com' })
  @MinLength(4)
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: true, example: '1234' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: true, example: '1234' })
  @IsNotEmpty()
  passwordConfirm: string;
}

export class SigninReqDto {
  @ApiProperty({ required: true, example: 'aa@a.com' })
  @MinLength(4)
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: true, example: '1234' })
  @IsNotEmpty()
  @MinLength(3)
  password: string;
}

export class VerifyAuthCodeReqDto {
  @ApiProperty({ required: true, example: '000000' })
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'Auth code must be a 6 digit number' }) // check is it 6 digit number
  authCode: string;
}
