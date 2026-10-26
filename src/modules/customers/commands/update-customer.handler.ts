import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCustomerCommand } from './update-customer.command';
import { CustomerResponseDto } from '../dto/customer.dto';
import { CustomersService } from '../customers.service';
import { AppLoggerService } from 'src/common/utils/app-logger.service';
import { LogAction } from 'src/modules/logs/schemas/log.schema';

@CommandHandler(UpdateCustomerCommand)
export class UpdateCustomerHandler implements ICommandHandler<
  UpdateCustomerCommand,
  CustomerResponseDto
> {
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
