import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sale, SaleDocument } from 'src/modules/sales/schemas/sale.schema';
import {
  Installment,
  InstallmentDocument,
} from 'src/modules/installments/schemas/installment.schema';
import {
  StoreInfo,
  StoreInfoDocument,
} from 'src/modules/store-info/schemas/store-info.schema';
import { PersianDate } from 'src/common/utils/persian-date';
import { GenerateInvoiceQuery } from 'src/modules/invoices/queries/generate-invoice.query';
import {
  InvoiceType,
  InvoiceResponseDto,
} from 'src/modules/invoices/dto/invoice.dto';

@QueryHandler(GenerateInvoiceQuery)
export class GenerateInvoiceHandler implements IQueryHandler<
  GenerateInvoiceQuery,
  InvoiceResponseDto
> {
  constructor(
    @InjectModel(Sale.name) private readonly saleModel: Model<SaleDocument>,
    @InjectModel(Installment.name)
    private readonly installmentModel: Model<InstallmentDocument>,
    @InjectModel(StoreInfo.name)
    private readonly storeModel: Model<StoreInfoDocument>,
  ) {}

  async execute(query: GenerateInvoiceQuery): Promise<InvoiceResponseDto> {
    const sale = await this.saleModel.findById(query.saleId).exec();
    if (!sale) throw new NotFoundException('فروش یافت نشد');

    let storeDoc = await this.storeModel.findOne().exec();
    if (!storeDoc) {
      storeDoc = await this.storeModel.create({});
    }

    const installments = await this.installmentModel
      .find({ saleId: sale._id })
      .sort({ installmentNumber: 1 })
      .exec();

    const invoiceNumber = `${storeDoc.invoicePrefix || 'INV'}-${new Date().getFullYear()}-${sale._id.toString().slice(-6).toUpperCase()}`;

    const totals = {
      purchasePrice: sale.purchasePrice,
      salePrice: sale.salePrice,
      downPayment: sale.downPayment,
      loanAmount: sale.loanAmount,
      totalProfit: sale.totalProfit,
      repaymentAmount: sale.repaymentAmount,
      installmentAmount: sale.installmentAmount,
      totalPaid: sale.totalPaid,
      remainingBalance: sale.remainingBalance,
      installmentCount: sale.installmentCount,
      startMonth: sale.startMonth,
      endMonth: sale.endMonth,
    };

    return {
      type: query.type,
      saleId: query.saleId,
      invoiceNumber,
      generatedAt: PersianDate.nowTimestamp(),
      storeInfo: {
        name: storeDoc.name,
        owner: storeDoc.owner,
        phone: storeDoc.phone,
        address: storeDoc.address,
        taxId: storeDoc.taxId,
        economicCode: storeDoc.economicCode,
        logo: storeDoc.logo,
        footerNote: storeDoc.footerNote,
      },
      sale: {
        id: sale._id.toString(),
        customerName: sale.customerName,
        phone: sale.phone,
        imei: sale.imei,
        phoneCustomer: sale.phoneCustomer,
        saleDate: sale.saleDate,
        guarantees: sale.guarantees,
        notes: sale.notes,
      },
      installments: installments.map((i) => ({
        id: i._id.toString(),
        installmentNumber: i.installmentNumber,
        dueDate: i.dueDate,
        monthLabel: PersianDate.monthLabel(i.dueDate),
        expectedAmount: i.expectedAmount,
        paidAmount: i.paidAmount,
        status: i.status,
        paidDate: i.paidDate ? PersianDate.toJalali(i.paidDate) : null,
        lateDays: i.lateDays,
      })),
      totals,
    };
  }
}
