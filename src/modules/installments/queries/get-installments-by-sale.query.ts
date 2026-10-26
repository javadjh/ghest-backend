import { IQuery } from '@nestjs/cqrs';

export class GetInstallmentsBySaleQuery implements IQuery {
  constructor(public readonly saleId: string) {}
}
