import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetPaymentByIdQuery } from '@/modules/payments/queries/get-payment-by-id.query';
import { PaymentsService } from '@/modules/payments/payments.service';
import { PaymentResponseDto } from '@/modules/payments/dto/payment.dto';

@QueryHandler(GetPaymentByIdQuery)
export class GetPaymentByIdHandler implements IQueryHandler<GetPaymentByIdQuery, PaymentResponseDto> {
  constructor(private readonly paymentsService: PaymentsService) {}

  async execute(query: GetPaymentByIdQuery): Promise<PaymentResponseDto> {
    const p = await this.paymentsService.findById(query.id);
    if (!p) throw new NotFoundException('پرداختی یافت نشد');
    return {
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
    };
  }
}
