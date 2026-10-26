import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCustomerCommand } from './create-customer.command';
import { CustomerResponseDto } from '../dto/customer.dto';
import { CustomersService } from '../customers.service';
import { AppLoggerService } from 'src/common/utils/app-logger.service';
import { LogAction } from 'src/modules/logs/schemas/log.schema';

@CommandHandler(CreateCustomerCommand)
export class CreateCustomerHandler implements ICommandHandler<
  CreateCustomerCommand,
  CustomerResponseDto
> {
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
