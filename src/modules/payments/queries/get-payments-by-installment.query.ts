import { IQuery } from '@nestjs/cqrs';

export class GetPaymentsByInstallmentQuery implements IQuery {
  constructor(public readonly installmentId: string) {}
}
