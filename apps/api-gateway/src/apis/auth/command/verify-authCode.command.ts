import { ICommand } from '@nestjs/cqrs';

export class VerifyAuthCodeCommand implements ICommand {
  constructor(
    readonly userId: string,
    readonly authCode: string,
    readonly email: string,
  ) {}
}
