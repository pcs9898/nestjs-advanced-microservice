import { Controller } from '@nestjs/common';
import { FindUserResDto } from './dto/res.dto';
import { UserService } from './user.service';
import { SignupReqDto } from './dto/req.dto';
import { QueryBus } from '@nestjs/cqrs';
import { FindOneUserQuery } from './query/find-one-user.query';
import { pageReqDto } from './common/dto/req.dto';
import { MessagePattern } from '@nestjs/microservices';
import { User } from './entity/user.entity';
import { PageResDto } from './common/dto/res.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern({ cmd: 'findUserByEmail' })
  async findUserByEmail(data: SignupReqDto): Promise<User> {
    return await this.userService.findUserByEmail(data);
  }

  @MessagePattern({ cmd: 'findUserById' })
  async findUserById({ id }: { id: string }): Promise<User> {
    return await this.userService.findUserById({ id });
  }

  @MessagePattern({ cmd: 'createUser' })
  async createUser(data: SignupReqDto): Promise<User> {
    return await this.userService.createUser(data);
  }

  @MessagePattern({ cmd: 'updateUserVerified' })
  async updateUserVerified({ id }: { id: string }): Promise<boolean> {
    return await this.userService.updateUserVerified({ id });
  }

  @MessagePattern({ cmd: 'isUserAdmin' })
  async isUserAdmin({ id }: { id: string }): Promise<User> {
    return await this.userService.isUserAdmin({ id });
  }

  @MessagePattern({ cmd: 'findAllUser' })
  async findAllUser(data: pageReqDto): Promise<PageResDto<FindUserResDto>> {
    const users = await this.userService.findAll(data);

    return {
      page: data.page,
      size: data.size,
      items: users.map((user) => FindUserResDto.toDto(user)),
    };
  }

  @MessagePattern({ cmd: 'findUserByIdNReturn' })
  async findUserByIdNReturn({ id }: { id: string }): Promise<FindUserResDto> {
    // const user = await this.userService.findUserById({id});
    const user = await this.queryBus.execute(new FindOneUserQuery(id));

    return FindUserResDto.toDto(user);
  }
}
