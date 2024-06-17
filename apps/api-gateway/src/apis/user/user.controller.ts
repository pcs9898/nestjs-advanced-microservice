import { FindAllUsersQuery } from './query/find-all-users.query';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { FindUserResDto } from './dto/res.dto';
import { PageResDto } from 'src/common/dto/res.dto';
import { pageReqDto } from 'src/common/dto/req.dto';
import { UserService } from './user.service';
import {
  ApiGetItemResponse,
  ApiGetResponse,
} from 'src/common/decorator/swagger.decorator';
import { AdminRolesGuard } from '../auth/guard/admin-roles.guard';
import { FindUserReqDto } from './dto/req.dto';
import { QueryBus } from '@nestjs/cqrs';
import { FindOneUserQuery } from './query/find-one-user.query';

@ApiBearerAuth()
@ApiTags('User')
@ApiExtraModels(FindUserResDto, PageResDto, pageReqDto)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,

    private readonly queryBus: QueryBus,
  ) {}

  @ApiGetItemResponse(PageResDto)
  @UseGuards(AdminRolesGuard)
  @Get('all/v1')
  async findAllV1(
    @Query() data: pageReqDto,
  ): Promise<PageResDto<FindUserResDto>> {
    const users = await this.userService.findAll(data);

    return {
      page: data.page,
      size: data.size,
      items: users.map((user) => FindUserResDto.toDto(user)),
    };
  }

  @ApiGetItemResponse(PageResDto)
  @UseGuards(AdminRolesGuard)
  @Get('all/v2')
  async findAllV2(
    @Query() data: pageReqDto,
  ): Promise<PageResDto<FindUserResDto>> {
    const users = await this.queryBus.execute(new FindAllUsersQuery(data));

    return {
      page: data.page,
      size: data.size,
      items: users.map((user) => FindUserResDto.toDto(user)),
    };
  }

  @ApiGetResponse(FindUserResDto)
  @Get(':id/v1')
  async findOneV1(@Param() { id }: FindUserReqDto): Promise<FindUserResDto> {
    const user = await this.userService.findOneById({ id });

    return FindUserResDto.toDto(user);
  }

  @ApiGetItemResponse(FindUserResDto)
  @Get(':id/v2')
  async findOneV2(@Param() { id }: FindUserReqDto): Promise<FindUserResDto> {
    const user = await this.queryBus.execute(new FindOneUserQuery(id));

    return FindUserResDto.toDto(user);
  }
}
