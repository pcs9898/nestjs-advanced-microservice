import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  accessSecret: process.env.PASSPORT_JWT_ACCESS_SECRET_KEY,
  refreshSecret: process.env.PASSPORT_JWT_REFRESH_SECRET_KEY,
  unVerifiedSecret: process.env.PASSPORT_JWT_UNVERIFIED_SECRET_KEY,
}));
