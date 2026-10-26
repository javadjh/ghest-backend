import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { ListSalesQuery } from 'src/modules/sales/queries/list-sales.query';
import { SalesService } from 'src/modules/sales/sales.service';
import { SaleResponseDto } from 'src/modules/sales/dto/sale.dto';

@QueryHandler(ListSalesQuery)
export class ListSalesHandler implements IQueryHandler<
  ListSalesQuery,
  { items: SaleResponseDto[]; total: number; page: number; limit: number }
> {
  constructor(private readonly salesService: SalesService) {}

  async execute(
    query: ListSalesQuery,
  ): Promise<{
    items: SaleResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { items, total } = await this.salesService.list(
      query.page,
      query.limit,
      query.filters,
    );
    return {
      items: items.map((s) => ({
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
      })),
      total,
      page: query.page,
      limit: query.limit,
    };
  }
}
