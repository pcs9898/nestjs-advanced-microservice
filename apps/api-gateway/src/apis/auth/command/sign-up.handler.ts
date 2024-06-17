import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignUpCommand } from './sign-up.command';
import { AuthService } from '../auth.service';
import { SignupResDto } from '../dto/res.dto';

@CommandHandler(SignUpCommand)
export class SignUpHandler implements ICommandHandler<SignUpCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute(command: SignUpCommand): Promise<SignupResDto> {
    const { data } = command;
    return await this.authService.signup(data);
  }
}
