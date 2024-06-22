import { IEvent } from '@nestjs/cqrs';

export class FindOneUserEvent implements IEvent {
  constructor(public readonly id: string) {}
}
