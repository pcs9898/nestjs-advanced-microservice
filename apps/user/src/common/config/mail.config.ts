import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  senderEmail: process.env.SENDER_EMAIL,
  senderEmailPassword: process.env.SENDER_EMAIL_PASSWORD,
}));
