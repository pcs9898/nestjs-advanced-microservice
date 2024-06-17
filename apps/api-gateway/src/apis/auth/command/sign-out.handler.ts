import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SignOutCommand } from './sign-out.command';
import { AuthService } from '../auth.service';
import { SignOutEvent } from '../event/sign-out-event';

@CommandHandler(SignOutCommand)
export class SignOutHandler implements ICommandHandler<SignOutCommand> {
  constructor(
    private readonly authService: AuthService,
    private eventBus: EventBus,
  ) {}

  async execute(command: SignOutCommand): Promise<boolean> {
    const { id } = command;

    const result = await this.authService.signout(id);

    this.eventBus.publish(new SignOutEvent(id));

    return result;
  }
}
