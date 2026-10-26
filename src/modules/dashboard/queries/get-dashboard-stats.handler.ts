import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Sale, SaleDocument, SaleStatus } from '@/modules/sales/schemas/sale.schema';
import { Installment, InstallmentDocument, InstallmentStatus } from '@/modules/installments/schemas/installment.schema';
import { Customer, CustomerDocument } from '@/modules/customers/schemas/customer.schema';
import { Payment, PaymentDocument } from '@/modules/payments/schemas/payment.schema';
import { PersianDate } from '@/common/utils/persian-date';
import { DashboardStatsDto } from '@/modules/dashboard/dto/dashboard.dto';
import { GetDashboardStatsQuery } from '@/modules/dashboard/queries/get-dashboard-stats.query';

@QueryHandler(GetDashboardStatsQuery)
export class GetDashboardStatsHandler implements IQueryHandler<GetDashboardStatsQuery, DashboardStatsDto> {
  constructor(
    @InjectModel(Sale.name) private readonly saleModel: Model<SaleDocument>,
    @InjectModel(Installment.name) private readonly installmentModel: Model<InstallmentDocument>,
    @InjectModel(Customer.name) private readonly customerModel: Model<CustomerDocument>,
    @InjectModel(Payment.name) private readonly paymentModel: Model<PaymentDocument>,
  ) {}

  async execute(): Promise<DashboardStatsDto> {
    const today = PersianDate.now();
    const todayStart = today; // YYYY/MM/DD
    const thisMonthKey = PersianDate.currentMonthKey();
    const thisYear = PersianDate.yearFromDate(today);

    const [sales, customers, installments, paymentsToday, thisMonthPayments, salesAgg] = await Promise.all([
      this.saleModel.find({ status: { $ne: SaleStatus.CANCELLED } }).exec(),
      this.customerModel.countDocuments().exec(),
      this.installmentModel.find().exec(),
      this.paymentModel.find({ paymentDate: todayStart }).exec(),
      this.paymentModel.find({ paymentDate: { $regex: `^${thisMonthKey}` } }).exec(),
      this.saleModel.aggregate([
        { $match: { status: { $ne: SaleStatus.CANCELLED } } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$salePrice' },
            totalPurchase: { $sum: '$purchasePrice' },
            totalSaleProfit: { $sum: '$saleProfit' },
            totalExpectedProfit: { $sum: '$totalProfit' },
          },
        },
      ]).exec(),
    ]);

    const totalRevenue = salesAgg[0]?.totalRevenue || 0;
    const totalPurchase = salesAgg[0]?.totalPurchase || 0;
    const totalExpectedProfit = salesAgg[0]?.totalExpectedProfit || 0;

    // Realized profit: sum of paid installments' profit portion
    // profit portion of each installment = profitPerInstallment * (paidAmount / expectedAmount)
    // Simpler: realized = sum(paidAmount / repaymentAmount * totalProfit) per sale
    // We have sales + installments, let's compute:
    let realized = 0;
    for (const sale of sales) {
      const insts = installments.filter((i) => i.saleId.toString() === sale._id.toString());
      const paidOnSale = insts.reduce((s, i) => s + (i.paidAmount || 0), 0);
      if (sale.repaymentAmount > 0) {
        const ratio = paidOnSale / sale.repaymentAmount;
        realized += sale.totalProfit * ratio;
      }
    }
    realized = Math.round(realized);

    // Outstanding: sum of (expectedAmount - paidAmount) for non-cancelled installments
    let totalOutstanding = 0;
    let totalPenalty = 0;
    let overdueCount = 0;
    let overdueAmount = 0;
    let thisMonthExpected = 0;
    let thisMonthPaid = 0;
    let thisMonthCount = 0;

    for (const i of installments) {
      if (i.status === InstallmentStatus.CANCELLED) continue;
      const remain = Math.max(0, i.expectedAmount - i.paidAmount);
      totalOutstanding += remain;
      totalPenalty += i.penaltyAmount || 0;
      // overdue
      if (i.status !== InstallmentStatus.PAID && i.dueDate < today) {
        const days = PersianDate.daysBetween(i.dueDate, today);
        if (days > 0) {
          overdueCount += 1;
          overdueAmount += remain;
        }
      }
      if (i.monthKey.startsWith(thisMonthKey)) {
        thisMonthExpected += i.expectedAmount;
        thisMonthPaid += i.paidAmount;
        thisMonthCount += 1;
      }
    }

    const todayPaymentsTotal = paymentsToday.reduce((s, p) => s + (p.amount || 0), 0);

    // this month profit: realized portion of installments paid this month
    // Simpler: sum of payments' corresponding profit ratio
    let thisMonthProfit = 0;
    for (const p of thisMonthPayments) {
      const sale = sales.find((s) => s._id.toString() === p.saleId.toString());
      if (!sale) continue;
      const ratio = sale.repaymentAmount > 0 ? p.amount / sale.repaymentAmount : 0;
      thisMonthProfit += sale.totalProfit * ratio;
    }
    thisMonthProfit = Math.round(thisMonthProfit);

    return {
      totalSales: sales.length,
      totalActiveSales: sales.filter((s) => s.status === SaleStatus.ACTIVE).length,
      totalCustomers: customers,
      totalRevenue,
      totalPurchase,
      totalProfit: totalExpectedProfit,
      totalRealizedProfit: realized,
      totalOutstanding,
      totalPenalty,
      overdueInstallmentsCount: overdueCount,
      overdueAmount,
      todayPayments: todayPaymentsTotal,
      todayPaymentsCount: paymentsToday.length,
      thisMonthProfit,
      thisMonthInstallmentsCount: thisMonthCount,
    };
  }
}
