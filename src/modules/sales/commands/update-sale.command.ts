import { ICommand } from '@nestjs/cqrs';
import { UpdateSaleDto } from '../dto/sale.dto';

export class UpdateSaleCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateSaleDto,
    public readonly actorId: string,
    public readonly actorName: string,
    public readonly ip?: string,
  ) {}
}
