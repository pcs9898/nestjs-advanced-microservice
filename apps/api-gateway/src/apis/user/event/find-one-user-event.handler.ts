import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { FindOneUserEvent } from './find-one-user-event';
import { Logger } from '@nestjs/common';

@EventsHandler(FindOneUserEvent)
export class FindOneUserEventHandler
  implements IEventHandler<FindOneUserEvent>
{
  handle(event: FindOneUserEvent) {
    const { id } = event;

    Logger.log(`id: ${id} was searched`);
  }
}
