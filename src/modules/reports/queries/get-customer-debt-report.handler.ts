import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PersianDate } from '@/common/utils/persian-date';
import { Installment, InstallmentDocument, InstallmentStatus } from '@/modules/installments/schemas/installment.schema';
import { Sale, SaleDocument, SaleStatus } from '@/modules/sales/schemas/sale.schema';
import { Customer, CustomerDocument } from '@/modules/customers/schemas/customer.schema';
import { GetCustomerDebtReportQuery } from '@/modules/reports/queries/get-customer-debt-report.query';
import { CustomerDebtDto } from '@/modules/reports/dto/report.dto';

@QueryHandler(GetCustomerDebtReportQuery)
export class GetCustomerDebtReportHandler implements IQueryHandler<GetCustomerDebtReportQuery, CustomerDebtDto[]> {
  constructor(
    @InjectModel(Installment.name) private readonly installmentModel: Model<InstallmentDocument>,
    @InjectModel(Sale.name) private readonly saleModel: Model<SaleDocument>,
    @InjectModel(Customer.name) private readonly customerModel: Model<CustomerDocument>,
  ) {}

  async execute(query: GetCustomerDebtReportQuery): Promise<CustomerDebtDto[]> {
    const today = PersianDate.now();
    const sales = query.customerId
      ? await this.saleModel.find({ customerId: new Types.ObjectId(query.customerId) }).exec()
      : await this.saleModel.find({ status: { $ne: SaleStatus.CANCELLED } }).exec();

    const customerIds = [...new Set(sales.map((s) => s.customerId.toString()))];
    const customers = await this.customerModel.find({ _id: { $in: customerIds } }).exec();
    const customerMap = new Map<string, any>();
    for (const c of customers) customerMap.set(c._id.toString(), c);

    const installmentSales = sales.map((s) => s._id);
    const installments = await this.installmentModel.find({ saleId: { $in: installmentSales } }).exec();

    // Build per-customer aggregate
    const map = new Map<string, any>();
    for (const s of sales) {
      const cid = s.customerId.toString();
      let item = map.get(cid);
      if (!item) {
        const customer = customerMap.get(cid);
        item = {
          customerId: cid,
          customerName: s.customerName,
          phone: customer?.phone || '',
          totalRepayment: 0,
          totalPaid: 0,
          totalRemaining: 0,
          activeSalesCount: 0,
          installmentsCount: 0,
          overdueInstallments: 0,
          overdueAmount: 0,
        };
        map.set(cid, item);
      }
      item.totalRepayment += s.repaymentAmount;
      item.totalPaid += s.totalPaid || 0;
      item.totalRemaining += s.remainingBalance || 0;
      if (s.status === SaleStatus.ACTIVE) item.activeSalesCount += 1;
    }

    for (const i of installments) {
      const cid = i.customerId.toString();
      const item = map.get(cid);
      if (!item) continue;
      item.installmentsCount += 1;
      if (i.status !== InstallmentStatus.PAID && i.status !== InstallmentStatus.CANCELLED) {
        if (i.dueDate < today) {
          item.overdueInstallments += 1;
          item.overdueAmount += Math.max(0, i.expectedAmount - i.paidAmount);
        }
      }
    }

    return Array.from(map.values()).sort((a, b) => b.totalRemaining - a.totalRemaining);
  }
}
