import { IQuery } from '@nestjs/cqrs';
import { ListInstallmentsDto } from 'src/modules/installments/dto/installment.dto';

export class ListInstallmentsQuery implements IQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 50,
    public readonly filters: ListInstallmentsDto,
  ) {}
}
