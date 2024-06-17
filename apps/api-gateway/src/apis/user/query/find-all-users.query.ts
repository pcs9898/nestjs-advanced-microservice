import { IQuery } from '@nestjs/cqrs';
import { pageReqDto } from 'src/common/dto/req.dto';

export class FindAllUsersQuery implements IQuery {
  constructor(public readonly data: pageReqDto) {}
}
