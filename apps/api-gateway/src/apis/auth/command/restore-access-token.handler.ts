import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RestoreAccessTokenCommand } from './restore-access-token.command';
import { AuthService } from '../auth.service';
import { RestoreAccessTokenResDto } from '../dto/res.dto';

@CommandHandler(RestoreAccessTokenCommand)
export class RestoreAccessTokenHandler
  implements ICommandHandler<RestoreAccessTokenCommand>
{
  constructor(private readonly authService: AuthService) {}

  async execute(
    command: RestoreAccessTokenCommand,
  ): Promise<RestoreAccessTokenResDto> {
    const { refreshToken, id } = command;
    return await this.authService.restoreAccessToken({
      refreshToken,
      userId: id,
    });
  }
}
