import { IQuery } from '@nestjs/cqrs';

export class GetPhoneProfitChartQuery implements IQuery {
  constructor(public readonly limit: number = 10) {}
}
