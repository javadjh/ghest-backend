import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PersianDate } from '../../../common/utils/persian-date';
import { Installment, InstallmentDocument, InstallmentStatus } from '../../installments/schemas/installment.schema';
import { Sale, SaleDocument } from '../../sales/schemas/sale.schema';
import { GetOverdueInstallmentsReportQuery } from './get-overdue-installments-report.query';
import { OverdueInstallmentDto } from '../dto/report.dto';

@QueryHandler(GetOverdueInstallmentsReportQuery)
export class GetOverdueInstallmentsReportHandler implements IQueryHandler<GetOverdueInstallmentsReportQuery, OverdueInstallmentDto[]> {
  constructor(
    @InjectModel(Installment.name) private readonly installmentModel: Model<InstallmentDocument>,
    @InjectModel(Sale.name) private readonly saleModel: Model<SaleDocument>,
  ) {}

  async execute(): Promise<OverdueInstallmentDto[]> {
    const today = PersianDate.now();
    const overdueInst = await this.installmentModel
      .find({
        status: { $in: [InstallmentStatus.PENDING, InstallmentStatus.PARTIAL] },
        dueDate: { $lt: today },
      })
      .sort({ dueDate: 1 })
      .exec();

    const saleIds = [...new Set(overdueInst.map((i) => i.saleId.toString()))];
    const sales = await this.saleModel.find({ _id: { $in: saleIds } }).exec();
    const saleMap = new Map<string, any>();
    for (const s of sales) saleMap.set(s._id.toString(), s);

    return overdueInst.map((i) => {
      const sale = saleMap.get(i.saleId.toString());
      const lateDays = PersianDate.daysBetween(i.dueDate, today);
      return {
        installmentId: (i._id as any).toString(),
        saleId: i.saleId.toString(),
        customerId: i.customerId.toString(),
        customerName: i.customerName,
        phone: sale?.phone || '',
        installmentNumber: i.installmentNumber,
        dueDate: i.dueDate,
        monthKey: i.monthKey,
        expectedAmount: i.expectedAmount,
        paidAmount: i.paidAmount,
        remaining: Math.max(0, i.expectedAmount - i.paidAmount),
        lateDays: lateDays > 0 ? lateDays : 0,
        penaltyAmount: i.penaltyAmount,
        phoneCustomer: i.customerName,
      };
    });
  }
}
