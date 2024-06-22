import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneUserQuery } from './find-one-user.query';
import { UserService } from '../user.service';

@QueryHandler(FindOneUserQuery)
export class FindOneUserHandler implements IQueryHandler {
  constructor(
    private readonly userService: UserService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: FindOneUserQuery) {
    const { id } = query;

    return await this.userService.findUserByIdNReturn({ id });
  }
}
