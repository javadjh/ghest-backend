import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetSaleByIdQuery } from '@/modules/sales/queries/get-sale-by-id.query';
import { SalesService } from '@/modules/sales/sales.service';
import { SaleResponseDto } from '@/modules/sales/dto/sale.dto';

@QueryHandler(GetSaleByIdQuery)
export class GetSaleByIdHandler implements IQueryHandler<GetSaleByIdQuery, SaleResponseDto> {
  constructor(private readonly salesService: SalesService) {}

  async execute(query: GetSaleByIdQuery): Promise<SaleResponseDto> {
    const s = await this.salesService.findById(query.id);
    if (!s) throw new NotFoundException('فروش یافت نشد');
    return {
      id: (s._id as any).toString(),
      customerId: (s.customerId as any).toString?.() || s.customerId,
      customerName: s.customerName,
      phone: s.phone,
      imei: s.imei,
      phoneCustomer: s.phoneCustomer,
      saleDate: s.saleDate,
      purchasePrice: s.purchasePrice,
      salePrice: s.salePrice,
      downPayment: s.downPayment,
      installmentCount: s.installmentCount,
      monthlyProfitRate: s.monthlyProfitRate,
      totalProfit: s.totalProfit,
      profitPerInstallment: s.profitPerInstallment,
      repaymentAmount: s.repaymentAmount,
      installmentAmount: s.installmentAmount,
      loanAmount: s.loanAmount,
      saleProfit: s.saleProfit,
      startMonth: s.startMonth,
      endMonth: s.endMonth,
      guarantees: s.guarantees,
      status: s.status,
      notes: s.notes,
      createdBy: (s.createdBy as any).toString?.() || s.createdBy,
      totalPaid: s.totalPaid,
      remainingBalance: s.remainingBalance,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    };
  }
}
