import { ICommand } from '@nestjs/cqrs';
import { UpdateCustomerDto } from '../dto/customer.dto';

export class UpdateCustomerCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateCustomerDto,
    public readonly actorId: string,
    public readonly actorName: string,
    public readonly ip?: string,
  ) {}
}
