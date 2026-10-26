import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { User, UserSchema } from 'src/modules/users/schemas/user.schema';
import { UsersService } from 'src/modules/users/users.service';
import { UsersController } from 'src/modules/users/users.controller';
import { CreateUserHandler } from 'src/modules/users/commands/create-user.handler';
import { UpdateUserHandler } from 'src/modules/users/commands/update-user.handler';
import { DeleteUserHandler } from 'src/modules/users/commands/delete-user.handler';
import { ResetPasswordHandler } from 'src/modules/users/commands/reset-password.handler';
import { ListUsersHandler } from 'src/modules/users/queries/list-users.handler';
import { GetUserByIdHandler } from 'src/modules/users/queries/get-user-by-id.handler';
import { LogsModule } from 'src/modules/logs/logs.module';

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
