import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from 'src/common/enum/global-enum';
import { pageReqDto } from 'src/common/dto/req.dto';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { PageResDto } from 'src/common/dto/res.dto';
import { FindUserResDto } from './dto/res.dto';

export interface IUserServiceUserIsUserAdmin {
  user_id: string;
}

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_SERVICE') private client: ClientProxy,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAllUser(data: pageReqDto): Promise<PageResDto<FindUserResDto>> {
    return await firstValueFrom(this.client.send({ cmd: 'findAllUser' }, data));
  }

  async findUserById({ id }: { id: string }) {
    return await firstValueFrom(
      this.client.send({ cmd: 'findUserById' }, { id }),
    );
  }

  async findUserByIdNReturn({ id }: { id: string }) {
    return await firstValueFrom(
      this.client.send({ cmd: 'findUserByIdNReturn' }, { id }),
    );
  }

  async isUserAdmin({
    user_id,
  }: IUserServiceUserIsUserAdmin): Promise<boolean> {
    const user = await firstValueFrom(
      this.client.send({ cmd: 'isUserAdmin' }, { id: user_id }),
    );

    return user.role === UserRole.Admin;
  }

  async removeUnVerifiedUserOver30Days() {
    const thirtyDays = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const usersShouldRemove = await this.userRepository
      .createQueryBuilder()
      .select()
      .where('is_verified=:is_verified', { is_verified: false })
      .andWhere('created_at<:thirtyDays', { thirtyDays })
      .getMany();

    for (const user of usersShouldRemove) {
      await this.userRepository.remove(user);
    }
  }
}
