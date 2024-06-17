import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Video } from '../video/entity/video.entity';
import { FindAllUsersHandler } from './query/find-all-users.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { FindOneUserHandler } from './query/find-one-user.handler';
import { FindOneUserEventHandler } from './event/find-one-user-event.handler';

@Module({
  imports: [TypeOrmModule.forFeature([User, Video]), CqrsModule],
  controllers: [UserController],
  providers: [
    UserService,
    FindAllUsersHandler,
    FindOneUserHandler,
    FindOneUserEventHandler,
  ],
  exports: [UserService],
})
export class UserModule {}
