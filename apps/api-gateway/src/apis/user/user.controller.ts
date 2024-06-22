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
  async findAllUserV1(
    @Query() data: pageReqDto,
  ): Promise<PageResDto<FindUserResDto>> {
    return await this.userService.findAllUser(data);
  }

  @ApiGetItemResponse(PageResDto)
  @UseGuards(AdminRolesGuard)
  @Get('all/v2')
  async findAllUserV2(
    @Query() data: pageReqDto,
  ): Promise<PageResDto<FindUserResDto>> {
    return await this.queryBus.execute(new FindAllUsersQuery(data));
  }

  @ApiGetResponse(FindUserResDto)
  @Get(':id/v1')
  async findOneV1(@Param() { id }: FindUserReqDto): Promise<FindUserResDto> {
    return await this.userService.findUserByIdNReturn({ id });
  }

  @ApiGetItemResponse(FindUserResDto)
  @Get(':id/v2')
  async findOneV2(@Param() { id }: FindUserReqDto): Promise<FindUserResDto> {
    return await this.queryBus.execute(new FindOneUserQuery(id));
  }
}
