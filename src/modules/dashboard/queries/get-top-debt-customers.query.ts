import { IQuery } from '@nestjs/cqrs';

export class GetTopDebtCustomersQuery implements IQuery {
  constructor(public readonly limit: number = 10) {}
}
