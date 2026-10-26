import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { DeleteCustomerCommand } from '@/modules/customers/commands/delete-customer.command';
import { CustomersService } from '@/modules/customers/customers.service';
import { AppLoggerService } from '@/common/utils/app-logger.service';
import { LogAction } from '@/modules/logs/schemas/log.schema';

@CommandHandler(DeleteCustomerCommand)
export class DeleteCustomerHandler implements ICommandHandler<DeleteCustomerCommand, void> {
  constructor(
    private readonly customersService: CustomersService,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(cmd: DeleteCustomerCommand): Promise<void> {
    const customer = await this.customersService.findById(cmd.id);
    await this.customersService.delete(cmd.id);
    await this.logger.log({
      action: LogAction.DELETE,
      entity: 'Customer',
      entityId: cmd.id,
      description: `حذف مشتری ${customer?.fullName || cmd.id}`,
      userId: cmd.actorId,
      username: cmd.actorName,
      ip: cmd.ip,
    });
  }
}
