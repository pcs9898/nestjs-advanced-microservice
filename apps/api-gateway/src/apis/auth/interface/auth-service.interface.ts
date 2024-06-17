export interface IAuthServiceVerifyEmailAuthCode {
  userId: string;
  authCode: string;
}

export type TAuthServiceSaveAuthCodeOnRedis = Pick<
  IAuthServiceVerifyEmailAuthCode,
  'userId'
> & {
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
