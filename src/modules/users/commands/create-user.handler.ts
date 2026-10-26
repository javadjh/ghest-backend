import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { CreateUserCommand } from 'src/modules/users/commands/create-user.command';
import { UsersService } from 'src/modules/users/users.service';
import { AppLoggerService } from 'src/common/utils/app-logger.service';
import { LogAction } from 'src/modules/logs/schemas/log.schema';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<
  CreateUserCommand,
  UserResponseDto
> {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(cmd: CreateUserCommand): Promise<UserResponseDto> {
    const user = await this.usersService.create(cmd.dto);
    const userDto: UserResponseDto = {
      id: (user._id as any).toString(),
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      phone: user.phone,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    await this.logger.log({
      action: LogAction.CREATE,
      entity: 'User',
      entityId: userDto.id,
      description: `ایجاد کاربر ${user.username} با نقش ${user.role}`,
      userId: cmd.actorId,
      username: cmd.actorName,
      ip: cmd.ip,
    });
    return userDto;
  }
}
