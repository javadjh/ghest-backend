import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { ListPaymentsQuery } from '@/modules/payments/queries/list-payments.query';
import { PaymentsService } from '@/modules/payments/payments.service';
import { PaymentResponseDto } from '@/modules/payments/dto/payment.dto';

@QueryHandler(ListPaymentsQuery)
export class ListPaymentsHandler implements IQueryHandler<ListPaymentsQuery, { items: PaymentResponseDto[]; total: number; page: number; limit: number }> {
  constructor(private readonly paymentsService: PaymentsService) {}

  async execute(query: ListPaymentsQuery): Promise<{ items: PaymentResponseDto[]; total: number; page: number; limit: number }> {
    const { items, total } = await this.paymentsService.list(query.page, query.limit, query.filters);
    return {
      items: items.map((p) => ({
        id: (p._id as any).toString(),
        saleId: p.saleId.toString(),
        installmentId: p.installmentId.toString(),
        customerId: p.customerId.toString(),
        customerName: p.customerName,
        amount: p.amount,
        paymentDate: p.paymentDate,
        paymentMethod: p.paymentMethod,
        receiptFileId: p.receiptFileId?.toString?.() || null,
        receiptFileName: p.receiptFileName,
        receiptOriginalName: (p as any).receiptOriginalName || p.receiptFileName,
        receiptUrl: p.receiptFileName ? `/uploads/${p.receiptFileName}` : undefined,
        notes: p.notes,
        createdBy: p.createdBy?.toString?.() || p.createdBy,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
      total,
      page: query.page,
      limit: query.limit,
    };
  }
}
