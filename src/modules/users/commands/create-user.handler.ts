import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { CreateUserCommand } from './create-user.command';
import { UsersService } from '../users.service';
import { AppLoggerService } from '../../../common/utils/app-logger.service';
import { LogAction } from '../../logs/schemas/log.schema';
import { UserResponseDto } from '../dto/user-response.dto';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand, UserResponseDto> {
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
