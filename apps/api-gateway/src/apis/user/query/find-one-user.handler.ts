import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneUserQuery } from './find-one-user.query';
import { UserService } from '../user.service';
import { FindOneUserEvent } from '../event/find-one-user-event';

@QueryHandler(FindOneUserQuery)
export class FindOneUserHandler implements IQueryHandler {
  constructor(
    private readonly userService: UserService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: FindOneUserQuery) {
    const { id } = query;

    this.eventBus.publish(new FindOneUserEvent(id));

    return await this.userService.findOneById({ id });
  }
}
