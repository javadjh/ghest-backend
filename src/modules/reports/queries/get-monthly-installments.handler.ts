import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PersianDate } from '../../../common/utils/persian-date';
import { Installment, InstallmentDocument, InstallmentStatus } from '../../installments/schemas/installment.schema';
import { Sale, SaleDocument } from '../../sales/schemas/sale.schema';
import { GetMonthlyInstallmentsQuery } from './get-monthly-installments.query';
import { MonthlyInstallmentsListDto } from '../dto/report.dto';

@QueryHandler(GetMonthlyInstallmentsQuery)
export class GetMonthlyInstallmentsHandler implements IQueryHandler<GetMonthlyInstallmentsQuery, MonthlyInstallmentsListDto[]> {
  constructor(
    @InjectModel(Installment.name) private readonly installmentModel: Model<InstallmentDocument>,
    @InjectModel(Sale.name) private readonly saleModel: Model<SaleDocument>,
  ) {}

  async execute(query: GetMonthlyInstallmentsQuery): Promise<MonthlyInstallmentsListDto[]> {
    const monthKey = query.monthKey || PersianDate.currentMonthKey();
    const installments = await this.installmentModel
      .find({ monthKey })
      .sort({ dueDate: 1, customerName: 1 })
      .exec();

    const saleIds = [...new Set(installments.map((i) => i.saleId.toString()))];
    const sales = await this.saleModel.find({ _id: { $in: saleIds } }).exec();
    const saleMap = new Map<string, any>();
    for (const s of sales) saleMap.set(s._id.toString(), s);

    const today = PersianDate.now();

    return installments.map((i) => {
      let lateDays = 0;
      if (i.status !== InstallmentStatus.PAID && i.status !== InstallmentStatus.CANCELLED) {
        const days = PersianDate.daysBetween(i.dueDate, today);
        lateDays = days > 0 ? days : 0;
      }
      const sale = saleMap.get(i.saleId.toString());
      return {
        monthKey: i.monthKey,
        monthLabel: PersianDate.monthLabel(i.dueDate),
        customerName: i.customerName,
        phone: sale?.phone || '',
        installmentNumber: i.installmentNumber,
        expectedAmount: i.expectedAmount,
        paidAmount: i.paidAmount,
        status: i.status,
        paidDate: i.paidDate ? PersianDate.toJalali(i.paidDate) : null,
        lateDays,
        customerId: i.customerId.toString(),
        saleId: i.saleId.toString(),
      };
    });
  }
}
