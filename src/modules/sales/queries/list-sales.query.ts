import { IQuery } from '@nestjs/cqrs';

export class ListSalesQuery implements IQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 20,
    public readonly filters: {
      search?: string;
      status?: string;
      customerId?: string;
      phoneModel?: string;
      fromDate?: string;
      toDate?: string;
    },
  ) {}
}
