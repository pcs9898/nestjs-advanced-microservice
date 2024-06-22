import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllUsersQuery } from './find-all-users.query';
import { UserService } from '../user.service';

@QueryHandler(FindAllUsersQuery)
export class FindAllUsersHandler implements IQueryHandler {
  constructor(private readonly userService: UserService) {}

  async execute(query: FindAllUsersQuery) {
    const { data } = query;

    return await this.userService.findAllUser(data);
  }
}
