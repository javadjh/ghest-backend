import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { ListInstallmentsQuery } from 'src/modules/installments/queries/list-installments.query';
import { InstallmentsService } from 'src/modules/installments/installments.service';
import { PersianDate } from 'src/common/utils/persian-date';
import { InstallmentResponseDto } from 'src/modules/installments/dto/installment.dto';

@QueryHandler(ListInstallmentsQuery)
export class ListInstallmentsHandler implements IQueryHandler<
  ListInstallmentsQuery,
  {
    items: InstallmentResponseDto[];
    total: number;
    page: number;
    limit: number;
  }
> {
  constructor(private readonly installmentsService: InstallmentsService) {}

  async execute(query: ListInstallmentsQuery): Promise<{
    items: InstallmentResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { items, total } = await this.installmentsService.list(
      query.page,
      query.limit,
      query.filters,
    );
    return {
      items: items.map((i) => ({
        id: (i._id as any).toString(),
        saleId: i.saleId.toString(),
        customerId: i.customerId.toString(),
        customerName: i.customerName,
        installmentNumber: i.installmentNumber,
        dueDate: i.dueDate,
        monthKey: i.monthKey,
        expectedAmount: i.expectedAmount,
        paidAmount: i.paidAmount,
        status: i.status,
        paidDate: i.paidDate,
        notes: i.notes,
        lateDays: i.lateDays,
        penaltyAmount: i.penaltyAmount,
        paymentIds: (i.paymentIds || []).map((p) => p.toString()),
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
      })),
      total,
      page: query.page,
      limit: query.limit,
    };
  }
}
