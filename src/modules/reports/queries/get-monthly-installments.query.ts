import { IQuery } from '@nestjs/cqrs';

export class GetMonthlyInstallmentsQuery implements IQuery {
  constructor(public readonly monthKey?: string) {}
}
