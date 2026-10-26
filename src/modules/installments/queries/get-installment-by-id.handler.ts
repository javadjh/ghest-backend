import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetInstallmentByIdQuery } from './get-installment-by-id.query';
import { InstallmentsService } from '../installments.service';
import { InstallmentResponseDto } from '../dto/installment.dto';

@QueryHandler(GetInstallmentByIdQuery)
export class GetInstallmentByIdHandler implements IQueryHandler<GetInstallmentByIdQuery, InstallmentResponseDto> {
  constructor(private readonly installmentsService: InstallmentsService) {}

  async execute(query: GetInstallmentByIdQuery): Promise<InstallmentResponseDto> {
    const i = await this.installmentsService.findById(query.id);
    if (!i) throw new NotFoundException('قسط یافت نشد');
    return {
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
    };
  }
}
