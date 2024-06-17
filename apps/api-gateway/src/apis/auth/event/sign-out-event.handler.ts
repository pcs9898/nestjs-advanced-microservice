import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SignOutEvent } from './sign-out-event';
import { Logger } from '@nestjs/common';

@EventsHandler(SignOutEvent)
export class SignOutEventHandler implements IEventHandler<SignOutEvent> {
  handle(event: SignOutEvent) {
    const { id } = event;

    Logger.log(`id: ${id} sign out`);
  }
}
