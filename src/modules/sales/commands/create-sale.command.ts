import { ICommand } from '@nestjs/cqrs';
import { CreateSaleDto } from 'src/modules/sales/dto/sale.dto';

export class CreateSaleCommand implements ICommand {
  constructor(
    public readonly dto: CreateSaleDto,
    public readonly actorId: string,
    public readonly actorName: string,
    public readonly ip?: string,
  ) {}
}
