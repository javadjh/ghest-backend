import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { UpdateCustomerCommand } from '@/modules/customers/commands/update-customer.command';
import { CustomersService } from '@/modules/customers/customers.service';
import { AppLoggerService } from '@/common/utils/app-logger.service';
import { LogAction } from '@/modules/logs/schemas/log.schema';
import { CustomerResponseDto } from '@/modules/customers/dto/customer.dto';

@CommandHandler(UpdateCustomerCommand)
export class UpdateCustomerHandler implements ICommandHandler<UpdateCustomerCommand, CustomerResponseDto> {
  constructor(
    private readonly customersService: CustomersService,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(cmd: UpdateCustomerCommand): Promise<CustomerResponseDto> {
    const customer = await this.customersService.update(cmd.id, cmd.dto);
    await this.logger.log({
      action: LogAction.UPDATE,
      entity: 'Customer',
      entityId: cmd.id,
      description: `به‌روزرسانی مشتری ${customer.fullName}`,
      userId: cmd.actorId,
      username: cmd.actorName,
      ip: cmd.ip,
      details: cmd.dto,
    });
    return {
      id: (customer._id as any).toString(),
      fullName: customer.fullName,
      phone: customer.phone,
      nationalId: customer.nationalId,
      address: customer.address,
      notes: customer.notes,
      totalPurchases: customer.totalPurchases,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }
}
