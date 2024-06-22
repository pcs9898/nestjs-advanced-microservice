import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Video } from '../video/entity/video.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { FindAllUsersHandler } from './query/find-all-users.handler';
import { FindOneUserHandler } from './query/find-one-user.handler';

@Module({
  imports: [TypeOrmModule.forFeature([User, Video]), CqrsModule],
  controllers: [UserController],
  providers: [
    UserService,
    FindAllUsersHandler,
    FindOneUserHandler,
    {
      provide: 'USER_SERVICE',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: 'user-service',
            port: 3001,
          },
        });
      },
    },
  ],
  exports: [UserService],
})
export class UserModule {}
