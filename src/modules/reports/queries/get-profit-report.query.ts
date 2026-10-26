import { IQuery } from '@nestjs/cqrs';

export class GetProfitReportQuery implements IQuery {
  constructor(
    public readonly startDate: string,
    public readonly endDate: string,
    public readonly period: 'daily' | 'monthly' | 'yearly' = 'monthly',
  ) {}
}
