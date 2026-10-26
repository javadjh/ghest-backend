import { IQuery } from '@nestjs/cqrs';
import { ListPaymentsDto } from '@/modules/payments/dto/payment.dto';

export class ListPaymentsQuery implements IQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly filters: ListPaymentsDto,
  ) {}
}
