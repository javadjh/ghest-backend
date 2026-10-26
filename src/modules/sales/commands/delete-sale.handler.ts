import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { DeleteSaleCommand } from './delete-sale.command';
import { SalesService } from '../sales.service';
import { AppLoggerService } from '../../../common/utils/app-logger.service';
import { LogAction } from '../../logs/schemas/log.schema';

@CommandHandler(DeleteSaleCommand)
export class DeleteSaleHandler implements ICommandHandler<DeleteSaleCommand, void> {
  constructor(
    private readonly salesService: SalesService,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(cmd: DeleteSaleCommand): Promise<void> {
    const sale = await this.salesService.findById(cmd.id);
    await this.salesService.delete(cmd.id);
    await this.logger.log({
      action: LogAction.DELETE,
      entity: 'Sale',
      entityId: cmd.id,
      description: `حذف فروش ${sale?.customerName || cmd.id} - ${sale?.phone || ''}`,
      userId: cmd.actorId,
      username: cmd.actorName,
      ip: cmd.ip,
    });
  }
}
