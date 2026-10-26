import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CreateUserHandler } from './commands/create-user.handler';
import { UpdateUserHandler } from './commands/update-user.handler';
import { DeleteUserHandler } from './commands/delete-user.handler';
import { ResetPasswordHandler } from './commands/reset-password.handler';
import { ListUsersHandler } from './queries/list-users.handler';
import { GetUserByIdHandler } from './queries/get-user-by-id.handler';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CqrsModule,
    LogsModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    CreateUserHandler,
    UpdateUserHandler,
    DeleteUserHandler,
    ResetPasswordHandler,
    ListUsersHandler,
    GetUserByIdHandler,
  ],
  exports: [UsersService],
})
export class UsersModule {}
