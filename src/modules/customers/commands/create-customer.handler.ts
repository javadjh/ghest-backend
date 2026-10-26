import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { CreateCustomerCommand } from './create-customer.command';
import { CustomersService } from '../customers.service';
import { AppLoggerService } from '../../../common/utils/app-logger.service';
import { LogAction } from '../../logs/schemas/log.schema';
import { CustomerResponseDto } from '../dto/customer.dto';

@CommandHandler(CreateCustomerCommand)
export class CreateCustomerHandler implements ICommandHandler<CreateCustomerCommand, CustomerResponseDto> {
  constructor(
    private readonly customersService: CustomersService,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(cmd: CreateCustomerCommand): Promise<CustomerResponseDto> {
    const customer = await this.customersService.create(cmd.dto);
    await this.logger.log({
      action: LogAction.CREATE,
      entity: 'Customer',
      entityId: (customer._id as any).toString(),
      description: `ایجاد مشتری ${customer.fullName}`,
      userId: cmd.actorId,
      username: cmd.actorName,
      ip: cmd.ip,
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
