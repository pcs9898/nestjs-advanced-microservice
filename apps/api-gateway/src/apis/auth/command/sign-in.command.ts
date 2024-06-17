import { ICommand } from '@nestjs/cqrs';
import { SigninReqDto } from '../dto/req.dto';

export class SignInCommand implements ICommand {
  constructor(public readonly data: SigninReqDto) {}
}
