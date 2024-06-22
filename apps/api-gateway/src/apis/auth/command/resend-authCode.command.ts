import { ICommand } from '@nestjs/cqrs';

export class ResendAuthCodeCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly email: string,
  ) {}
}
