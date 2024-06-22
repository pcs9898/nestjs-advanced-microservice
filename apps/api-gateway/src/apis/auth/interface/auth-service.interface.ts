import {
  IAuthUser,
  IJwtUnVerifiedPayload,
} from 'src/common/types/global-types';

export interface IAuthServiceVerifyEmailAuthCode {
  userId: string;
  email: string;
  authCode: string;
}

export type TAuthServiceSaveAuthCodeOnRedis = Pick<
  IAuthServiceVerifyEmailAuthCode,
  'userId'
> & {
  email: string;
  authCode: number;
  ttl: number;
};

export interface IAuthServiceSaveHashedRefreshTokenOnRedis {
  userId: string;
  hashedRefreshToken: string;
}

export interface IAuthServiceRestoreAccessToken {
  userId: string;
  refreshToken: string;
}

export interface IAuthServiceResendAuthCode extends IJwtUnVerifiedPayload {}
