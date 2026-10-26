import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { DeleteUserCommand } from './delete-user.command';
import { UsersService } from '../users.service';
import { AppLoggerService } from '../../../common/utils/app-logger.service';
import { LogAction } from '../../logs/schemas/log.schema';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand, void> {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(cmd: DeleteUserCommand): Promise<void> {
    const user = await this.usersService.findById(cmd.id);
    await this.usersService.delete(cmd.id, cmd.actorId);
    await this.logger.log({
      action: LogAction.DELETE,
      entity: 'User',
      entityId: cmd.id,
      description: `حذف کاربر ${user?.username || cmd.id}`,
      userId: cmd.actorId,
      username: cmd.actorName,
      ip: cmd.ip,
    });
  }
}
