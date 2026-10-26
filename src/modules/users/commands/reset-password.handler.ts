import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { ResetPasswordCommand } from '@/modules/users/commands/reset-password.command';
import { UsersService } from '@/modules/users/users.service';
import { AppLoggerService } from '@/common/utils/app-logger.service';
import { LogAction } from '@/modules/logs/schemas/log.schema';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler implements ICommandHandler<ResetPasswordCommand, void> {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(cmd: ResetPasswordCommand): Promise<void> {
    await this.usersService.resetPassword(cmd.id, cmd.newPassword);
    await this.logger.log({
      action: LogAction.UPDATE,
      entity: 'User',
      entityId: cmd.id,
      description: `بازنشانی رمز عبور کاربر ${cmd.id}`,
      userId: cmd.actorId,
      username: cmd.actorName,
      ip: cmd.ip,
    });
  }
}
