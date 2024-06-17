import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../auth.service';
import { VerifyAuthCodeResDto } from '../dto/res.dto';
import { VerifyAuthCodeCommand } from './verify-authCode.command';

@CommandHandler(VerifyAuthCodeCommand)
export class VerifyAuthCodeHandler
  implements ICommandHandler<VerifyAuthCodeCommand>
{
  constructor(private readonly authService: AuthService) {}

  async execute(command: VerifyAuthCodeCommand): Promise<VerifyAuthCodeResDto> {
    const { userId, authCode } = command;

    return await this.authService.verifyAuthCode({ userId, authCode });
  }
}
