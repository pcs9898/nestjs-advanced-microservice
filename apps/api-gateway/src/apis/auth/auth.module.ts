import { Logger, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';
import { JwtAccessStrategy } from './strategy/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { JwtUnVerifiedStrategy } from './strategy/jwt-unVerified.strategy';
import { SignUpHandler } from './command/sign-up.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { VerifyAuthCodeHandler } from './command/verify-authCode.handler';
import { SignInHandler } from './command/sign-in.handler';
import { ResendAuthCodeHandler } from './command/resend-authCode.handler';
import { RestoreAccessTokenHandler } from './command/restore-access-token.handler';
import { SignOutHandler } from './command/sign-out.handler';
import { SignOutEventHandler } from './event/sign-out-event.handler';

@Module({
  imports: [UserModule, PassportModule, JwtModule, MailModule, CqrsModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtUnVerifiedStrategy,
    Logger,
    SignUpHandler,
    VerifyAuthCodeHandler,
    SignInHandler,
    ResendAuthCodeHandler,
    RestoreAccessTokenHandler,
    SignOutHandler,
    SignOutEventHandler,
  ],
})
export class AuthModule {}
