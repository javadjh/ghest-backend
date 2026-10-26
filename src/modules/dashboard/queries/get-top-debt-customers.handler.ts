import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Installment, InstallmentDocument, InstallmentStatus } from '@/modules/installments/schemas/installment.schema';
import { Sale, SaleDocument, SaleStatus } from '@/modules/sales/schemas/sale.schema';
import { PersianDate } from '@/common/utils/persian-date';
import { TopDebtCustomerDto } from '@/modules/dashboard/dto/dashboard.dto';
import { GetTopDebtCustomersQuery } from '@/modules/dashboard/queries/get-top-debt-customers.query';

@QueryHandler(GetTopDebtCustomersQuery)
export class GetTopDebtCustomersHandler implements IQueryHandler<GetTopDebtCustomersQuery, TopDebtCustomerDto[]> {
  constructor(
    @InjectModel(Installment.name) private readonly installmentModel: Model<InstallmentDocument>,
    @InjectModel(Sale.name) private readonly saleModel: Model<SaleDocument>,
  ) {}

  async execute(query: GetTopDebtCustomersQuery): Promise<TopDebtCustomerDto[]> {
    const limit = Math.min(Math.max(query.limit, 1), 50);

    // Active sales only
    const activeSales = await this.saleModel.find({ status: SaleStatus.ACTIVE }).exec();
    const saleIds = activeSales.map((s) => s._id);
    if (saleIds.length === 0) return [];

    const installments = await this.installmentModel
      .find({ saleId: { $in: saleIds }, status: { $nin: [InstallmentStatus.PAID, InstallmentStatus.CANCELLED] } })
      .exec();

    const customerMap = new Map<string, { customerId: string; customerName: string; totalDebt: number; activeSalesCount: number }>();
    for (const i of installments) {
      const cid = i.customerId.toString();
      const remain = Math.max(0, i.expectedAmount - i.paidAmount);
      const existing = customerMap.get(cid) || {
        customerId: cid,
        customerName: i.customerName,
        totalDebt: 0,
        activeSalesCount: 0,
      };
      existing.totalDebt += remain;
      customerMap.set(cid, existing);
    }

    // Count active sales per customer
    const activeCount = new Map<string, number>();
    for (const s of activeSales) {
      const cid = s.customerId.toString();
      activeCount.set(cid, (activeCount.get(cid) || 0) + 1);
    }
    for (const [cid, item] of customerMap.entries()) {
      item.activeSalesCount = activeCount.get(cid) || 0;
    }

    return Array.from(customerMap.values())
      .sort((a, b) => b.totalDebt - a.totalDebt)
      .slice(0, limit);
  }
}
