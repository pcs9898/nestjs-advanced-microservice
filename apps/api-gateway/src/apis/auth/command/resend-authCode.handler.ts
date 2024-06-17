import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResendAuthCodeCommand } from './resend-authCode.command';
import { AuthService } from '../auth.service';

@CommandHandler(ResendAuthCodeCommand)
export class ResendAuthCodeHandler
  implements ICommandHandler<ResendAuthCodeCommand>
{
  constructor(private readonly authService: AuthService) {}
  async execute(command: ResendAuthCodeCommand): Promise<boolean> {
    const { id } = command;
    return await this.authService.resendAuthCode(id);
  }
}
