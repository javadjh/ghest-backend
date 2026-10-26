import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { UpdateUserCommand } from './update-user.command';
import { UsersService } from '../users.service';
import { AppLoggerService } from '../../../common/utils/app-logger.service';
import { LogAction } from '../../logs/schemas/log.schema';
import { UserResponseDto } from '../dto/user-response.dto';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand, UserResponseDto> {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(cmd: UpdateUserCommand): Promise<UserResponseDto> {
    const user = await this.usersService.update(cmd.id, cmd.dto);
    await this.logger.log({
      action: LogAction.UPDATE,
      entity: 'User',
      entityId: cmd.id,
      description: `به‌روزرسانی کاربر ${user.username}`,
      userId: cmd.actorId,
      username: cmd.actorName,
      ip: cmd.ip,
      details: cmd.dto,
    });
    return {
      id: (user._id as any).toString(),
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      phone: user.phone,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
