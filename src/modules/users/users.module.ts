import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { User, UserSchema } from '@/modules/users/schemas/user.schema';
import { UsersService } from '@/modules/users/users.service';
import { UsersController } from '@/modules/users/users.controller';
import { CreateUserHandler } from '@/modules/users/commands/create-user.handler';
import { UpdateUserHandler } from '@/modules/users/commands/update-user.handler';
import { DeleteUserHandler } from '@/modules/users/commands/delete-user.handler';
import { ResetPasswordHandler } from '@/modules/users/commands/reset-password.handler';
import { ListUsersHandler } from '@/modules/users/queries/list-users.handler';
import { GetUserByIdHandler } from '@/modules/users/queries/get-user-by-id.handler';
import { LogsModule } from '@/modules/logs/logs.module';

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
