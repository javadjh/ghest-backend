import { IQuery } from '@nestjs/cqrs';

export class GetMonthlyProfitChartQuery implements IQuery {
  constructor(public readonly monthsBack: number = 12) {}
}
