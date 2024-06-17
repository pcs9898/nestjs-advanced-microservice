import { IEvent } from '@nestjs/cqrs';

export class SignOutEvent implements IEvent {
  constructor(readonly id: string) {}
}
