import { ICommand } from '@nestjs/cqrs';

export class RestoreAccessTokenCommand implements ICommand {
  constructor(
    public readonly refreshToken: string,
    public readonly id: string,
  ) {}
}
