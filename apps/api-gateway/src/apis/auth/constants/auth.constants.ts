export const SALT_ROUNDS = 10;
export const THIRTY_DAYS_IN_SECONDS = 30 * 24 * 60 * 60;
export const TWENTY_MINUTES_IN_SECONDS = 20 * 60;
export const JwtUnVerifiedGuardAllowPath = [
  '/auth/verifyAuthCode/v1',
  '/auth/resendAuthCode/v1',
  '/auth/restoreAccessToken/v1',
  '/auth/verifyAuthCode/v2',
  '/auth/resendAuthCode/v2',
  '/auth/restoreAccessToken/v2',
];
