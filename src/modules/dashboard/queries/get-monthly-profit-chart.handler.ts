import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PersianDate } from '@/common/utils/persian-date';
import { Installment, InstallmentDocument } from '@/modules/installments/schemas/installment.schema';
import { Sale, SaleDocument } from '@/modules/sales/schemas/sale.schema';
import { MonthlyProfitChartItem } from '@/modules/dashboard/dto/dashboard.dto';
import { GetMonthlyProfitChartQuery } from '@/modules/dashboard/queries/get-monthly-profit-chart.query';

@QueryHandler(GetMonthlyProfitChartQuery)
export class GetMonthlyProfitChartHandler implements IQueryHandler<GetMonthlyProfitChartQuery, MonthlyProfitChartItem[]> {
  constructor(
    @InjectModel(Installment.name) private readonly installmentModel: Model<InstallmentDocument>,
    @InjectModel(Sale.name) private readonly saleModel: Model<SaleDocument>,
  ) {}

  async execute(query: GetMonthlyProfitChartQuery): Promise<MonthlyProfitChartItem[]> {
    const today = PersianDate.now();
    const monthsBack = Math.min(Math.max(query.monthsBack, 1), 24);

    // Build list of last N month keys
    const monthKeys: { key: string; label: string }[] = [];
    const todayYear = PersianDate.yearFromDate(today);
    const todayMonth = PersianDate.monthNumberFromDate(today);

    for (let i = monthsBack - 1; i >= 0; i--) {
      let m = todayMonth - i;
      let y = todayYear;
      while (m <= 0) {
        m += 12;
        y -= 1;
      }
      const key = `${y}/${m.toString().padStart(2, '0')}`;
      const label = PersianDate.monthLabel(`${key}/01`);
      monthKeys.push({ key, label });
    }

    const all = await this.installmentModel.find({ monthKey: { $in: monthKeys.map((m) => m.key) } }).exec();
    const sales = await this.saleModel.find({}).exec();
    const saleMap = new Map<string, any>();
    for (const s of sales) saleMap.set(s._id.toString(), s);

    const items: MonthlyProfitChartItem[] = [];
    for (const mk of monthKeys) {
      const insts = all.filter((i) => i.monthKey === mk.key);
      let expected = 0;
      let paid = 0;
      let profit = 0;
      for (const inst of insts) {
        expected += inst.expectedAmount || 0;
        paid += inst.paidAmount || 0;
        const sale = saleMap.get(inst.saleId.toString());
        if (sale && sale.repaymentAmount > 0) {
          const ratio = inst.paidAmount / sale.repaymentAmount;
          profit += sale.totalProfit * ratio;
        }
      }
      items.push({
        monthKey: mk.key,
        monthLabel: mk.label,
        profit: Math.round(profit),
        installmentCount: insts.length,
        expectedAmount: expected,
        paidAmount: paid,
      });
    }
    return items;
  }
}
