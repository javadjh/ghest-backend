import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { DeletePaymentCommand } from './delete-payment.command';
import { PaymentsService } from '../payments.service';
import { AppLoggerService } from '../../../common/utils/app-logger.service';
import { LogAction } from '../../logs/schemas/log.schema';

@CommandHandler(DeletePaymentCommand)
export class DeletePaymentHandler implements ICommandHandler<DeletePaymentCommand, void> {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(cmd: DeletePaymentCommand): Promise<void> {
    const payment = await this.paymentsService.findById(cmd.id);
    await this.paymentsService.delete(cmd.id);
    await this.logger.log({
      action: LogAction.DELETE,
      entity: 'Payment',
      entityId: cmd.id,
      description: `حذف پرداختی ${payment?.amount || ''} - ${payment?.customerName || ''}`,
      userId: cmd.actorId,
      username: cmd.actorName,
      ip: cmd.ip,
    });
  }
}
