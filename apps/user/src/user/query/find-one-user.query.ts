import { IQuery } from '@nestjs/cqrs';

export class FindOneUserQuery implements IQuery {
  constructor(public readonly id: string) {}
}
