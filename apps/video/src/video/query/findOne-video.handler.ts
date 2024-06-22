import { IQuery } from '@nestjs/cqrs';

export class FindOneVideoQuery implements IQuery {
  constructor(public readonly id: string) {}
}
