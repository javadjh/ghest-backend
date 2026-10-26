import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PersianDate } from 'src/common/utils/persian-date';
import {
  Sale,
  SaleDocument,
  SaleStatus,
} from 'src/modules/sales/schemas/sale.schema';
import {
  Installment,
  InstallmentDocument,
  InstallmentStatus,
} from 'src/modules/installments/schemas/installment.schema';
import {
  Payment,
  PaymentDocument,
} from 'src/modules/payments/schemas/payment.schema';
import { GetProfitReportQuery } from 'src/modules/reports/queries/get-profit-report.query';
import {
  ProfitByPeriodDto,
  ProfitByMonthItem,
} from 'src/modules/reports/dto/report.dto';

@QueryHandler(GetProfitReportQuery)
export class GetProfitReportHandler implements IQueryHandler<
  GetProfitReportQuery,
  ProfitByPeriodDto & { items: ProfitByMonthItem[] }
> {
  constructor(
    @InjectModel(Sale.name) private readonly saleModel: Model<SaleDocument>,
    @InjectModel(Installment.name)
    private readonly installmentModel: Model<InstallmentDocument>,
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
  ) {}

  async execute(
    query: GetProfitReportQuery,
  ): Promise<ProfitByPeriodDto & { items: ProfitByMonthItem[] }> {
    const start = query.startDate;
    const end = query.endDate;

    // Get sales in range by saleDate (Jalali YYYY/MM/DD string compare works lexicographically since fixed format)
    const sales = await this.saleModel
      .find({
        saleDate: { $gte: start, $lte: end },
        status: { $ne: SaleStatus.CANCELLED },
      })
      .exec();

    const saleIds = sales.map((s) => s._id);
    const installments = await this.installmentModel
      .find({ saleId: { $in: saleIds } })
      .exec();
    const payments = await this.paymentModel
      .find({ saleId: { $in: saleIds } })
      .exec();

    const saleMap = new Map<string, any>();
    for (const s of sales) saleMap.set(s._id.toString(), s);

    let totalRevenue = 0;
    let totalPurchase = 0;
    let totalExpectedProfit = 0;
    let totalRealized = 0;
    let totalPaid = 0;

    for (const s of sales) {
      totalRevenue += s.salePrice;
      totalPurchase += s.purchasePrice;
      totalExpectedProfit += s.totalProfit;
    }

    for (const i of installments) {
      totalPaid += i.paidAmount || 0;
      const sale = saleMap.get(i.saleId.toString());
      if (sale && sale.repaymentAmount > 0) {
        const ratio = i.paidAmount / sale.repaymentAmount;
        totalRealized += sale.totalProfit * ratio;
      }
    }

    // Build items by period
    const itemsMap = new Map<string, ProfitByMonthItem>();
    for (const i of installments) {
      let key: string;
      let label: string;
      if (query.period === 'yearly') {
        const y = PersianDate.yearFromDate(i.dueDate);
        key = `${y}`;
        label = `سال ${y}`;
      } else if (query.period === 'daily') {
        key = i.dueDate;
        label = i.dueDate;
      } else {
        key = i.monthKey;
        label = PersianDate.monthLabel(i.dueDate);
      }
      let item = itemsMap.get(key);
      if (!item) {
        item = {
          monthKey: key,
          monthLabel: label,
          revenue: 0,
          purchase: 0,
          expectedProfit: 0,
          realizedProfit: 0,
          paidAmount: 0,
        };
        itemsMap.set(key, item);
      }
      item.paidAmount += i.paidAmount || 0;
      const sale = saleMap.get(i.saleId.toString());
      if (sale) {
        if (sale.repaymentAmount > 0) {
          const ratio = i.paidAmount / sale.repaymentAmount;
          item.realizedProfit += sale.totalProfit * ratio;
        }
        item.expectedProfit +=
          sale.totalProfit * (i.expectedAmount / sale.repaymentAmount);
      }
    }

    // For revenue/purchase, attach to the sale's month
    for (const s of sales) {
      let key: string;
      let label: string;
      if (query.period === 'yearly') {
        const y = PersianDate.yearFromDate(s.saleDate);
        key = `${y}`;
        label = `سال ${y}`;
      } else if (query.period === 'daily') {
        key = s.saleDate;
        label = s.saleDate;
      } else {
        key = PersianDate.monthKey(s.saleDate);
        label = PersianDate.monthLabel(s.saleDate);
      }
      let item = itemsMap.get(key);
      if (!item) {
        item = {
          monthKey: key,
          monthLabel: label,
          revenue: 0,
          purchase: 0,
          expectedProfit: 0,
          realizedProfit: 0,
          paidAmount: 0,
        };
        itemsMap.set(key, item);
      }
      item.revenue += s.salePrice;
      item.purchase += s.purchasePrice;
    }

    const items = Array.from(itemsMap.values())
      .map((it) => ({
        ...it,
        realizedProfit: Math.round(it.realizedProfit),
        expectedProfit: Math.round(it.expectedProfit),
      }))
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey));

    return {
      period: query.period,
      startDate: start,
      endDate: end,
      totalRevenue,
      totalPurchase,
      totalExpectedProfit,
      totalRealizedProfit: Math.round(totalRealized),
      totalPaid,
      salesCount: sales.length,
      items,
    };
  }
}
