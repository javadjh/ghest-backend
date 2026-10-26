import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sale, SaleDocument, SaleStatus } from '@/modules/sales/schemas/sale.schema';
import { PhoneProfitChartItem } from '@/modules/dashboard/dto/dashboard.dto';
import { GetPhoneProfitChartQuery } from '@/modules/dashboard/queries/get-phone-profit-chart.query';

@QueryHandler(GetPhoneProfitChartQuery)
export class GetPhoneProfitChartHandler implements IQueryHandler<GetPhoneProfitChartQuery, PhoneProfitChartItem[]> {
  constructor(
    @InjectModel(Sale.name) private readonly saleModel: Model<SaleDocument>,
  ) {}

  async execute(query: GetPhoneProfitChartQuery): Promise<PhoneProfitChartItem[]> {
    const limit = Math.min(Math.max(query.limit, 1), 50);
    const agg = await this.saleModel.aggregate([
      { $match: { status: { $ne: SaleStatus.CANCELLED } } },
      {
        $group: {
          _id: '$phone',
          count: { $sum: 1 },
          totalProfit: { $sum: '$totalProfit' },
          totalSale: { $sum: '$salePrice' },
        },
      },
      { $sort: { totalProfit: -1 } },
      { $limit: limit },
    ]).exec();
    return agg.map((a) => ({
      phoneModel: a._id || 'نامشخص',
      count: a.count,
      totalProfit: a.totalProfit,
      totalSale: a.totalSale,
    }));
  }
}
