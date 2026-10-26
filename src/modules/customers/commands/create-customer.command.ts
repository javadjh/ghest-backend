import { ICommand } from '@nestjs/cqrs';
import { CreateCustomerDto } from '@/modules/customers/dto/customer.dto';

export class CreateCustomerCommand implements ICommand {
  constructor(
    public readonly dto: CreateCustomerDto,
    public readonly actorId: string,
    public readonly actorName: string,
    public readonly ip?: string,
  ) {}
}
