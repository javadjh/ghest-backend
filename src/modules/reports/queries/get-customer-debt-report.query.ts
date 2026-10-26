import { IQuery } from '@nestjs/cqrs';

export class GetCustomerDebtReportQuery implements IQuery {
  constructor(public readonly customerId?: string) {}
}
