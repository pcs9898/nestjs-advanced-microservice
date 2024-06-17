import { ICommand } from '@nestjs/cqrs';
import { SignupReqDto } from '../dto/req.dto';

export class SignUpCommand implements ICommand {
  constructor(readonly data: SignupReqDto) {}
}
