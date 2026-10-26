import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
import { GetRealizedProfitPerSaleQuery } from 'src/modules/reports/queries/get-realized-profit-per-sale.query';
import { RealizedProfitPerSaleDto } from 'src/modules/reports/dto/report.dto';

@QueryHandler(GetRealizedProfitPerSaleQuery)
export class GetRealizedProfitPerSaleHandler implements IQueryHandler<
  GetRealizedProfitPerSaleQuery,
  RealizedProfitPerSaleDto[]
> {
  constructor(
    @InjectModel(Sale.name) private readonly saleModel: Model<SaleDocument>,
    @InjectModel(Installment.name)
    private readonly installmentModel: Model<InstallmentDocument>,
  ) {}

  async execute(): Promise<RealizedProfitPerSaleDto[]> {
    const sales = await this.saleModel
      .find({ status: { $ne: SaleStatus.CANCELLED } })
      .sort({ saleDate: -1 })
      .exec();
    const saleIds = sales.map((s) => s._id);
    const installments = await this.installmentModel
      .find({ saleId: { $in: saleIds } })
      .exec();

    return sales.map((s) => {
      const insts = installments.filter(
        (i) => i.saleId.toString() === s._id.toString(),
      );
      const paid = insts.reduce((sum, i) => sum + (i.paidAmount || 0), 0);
      const ratio = s.repaymentAmount > 0 ? paid / s.repaymentAmount : 0;
      const realized = Math.round(s.totalProfit * ratio);
      return {
        saleId: s._id.toString(),
        customerName: s.customerName,
        phone: s.phone,
        saleDate: s.saleDate,
        repaymentAmount: s.repaymentAmount,
        totalPaid: paid,
        totalProfit: s.totalProfit,
        realizedProfit: realized,
        remainingProfit: Math.max(0, s.totalProfit - realized),
        completionRatio: Math.round(ratio * 1000) / 10,
      };
    });
  }
}
