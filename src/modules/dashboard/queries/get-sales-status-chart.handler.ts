import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sale, SaleDocument, SaleStatus } from '../../sales/schemas/sale.schema';
import { SalesStatusChartItem } from '../../dashboard/dto/dashboard.dto';
import { GetSalesStatusChartQuery } from './get-sales-status-chart.query';

@QueryHandler(GetSalesStatusChartQuery)
export class GetSalesStatusChartHandler implements IQueryHandler<GetSalesStatusChartQuery, SalesStatusChartItem[]> {
  constructor(
    @InjectModel(Sale.name) private readonly saleModel: Model<SaleDocument>,
  ) {}

  async execute(): Promise<SalesStatusChartItem[]> {
    const agg = await this.saleModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]).exec();
    const map: Record<string, number> = {
      active: 0,
      completed: 0,
      defaulted: 0,
      cancelled: 0,
    };
    for (const a of agg) map[a._id] = a.count;
    return [
      { status: 'فعال', count: map['active'] || 0 },
      { status: 'تکمیل شده', count: map['completed'] || 0 },
      { status: 'باخیم', count: map['defaulted'] || 0 },
      { status: 'لغو شده', count: map['cancelled'] || 0 },
    ];
  }
}
