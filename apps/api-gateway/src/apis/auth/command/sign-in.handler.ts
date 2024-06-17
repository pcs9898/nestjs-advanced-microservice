import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignInCommand } from './sign-in.command';
import { AuthService } from '../auth.service';
import { SigninResDto } from '../dto/res.dto';

@CommandHandler(SignInCommand)
export class SignInHandler implements ICommandHandler<SignInCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute(command: SignInCommand): Promise<SigninResDto> {
    const { data } = command;
    return await this.authService.signin(data);
  }
}
