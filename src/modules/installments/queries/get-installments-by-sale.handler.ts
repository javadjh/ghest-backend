import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetInstallmentsBySaleQuery } from '@/modules/installments/queries/get-installments-by-sale.query';
import { InstallmentsService } from '@/modules/installments/installments.service';
import { InstallmentResponseDto } from '@/modules/installments/dto/installment.dto';

@QueryHandler(GetInstallmentsBySaleQuery)
export class GetInstallmentsBySaleHandler implements IQueryHandler<GetInstallmentsBySaleQuery, InstallmentResponseDto[]> {
  constructor(private readonly installmentsService: InstallmentsService) {}

  async execute(query: GetInstallmentsBySaleQuery): Promise<InstallmentResponseDto[]> {
    const items = await this.installmentsService.findBySale(query.saleId);
    return items.map((i) => ({
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
    }));
  }
}
