import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { GetPaymentsByInstallmentQuery } from 'src/modules/payments/queries/get-payments-by-installment.query';
import { PaymentsService } from 'src/modules/payments/payments.service';
import { PaymentResponseDto } from 'src/modules/payments/dto/payment.dto';

@QueryHandler(GetPaymentsByInstallmentQuery)
export class GetPaymentsByInstallmentHandler implements IQueryHandler<
  GetPaymentsByInstallmentQuery,
  PaymentResponseDto[]
> {
  constructor(private readonly paymentsService: PaymentsService) {}

  async execute(
    query: GetPaymentsByInstallmentQuery,
  ): Promise<PaymentResponseDto[]> {
    const items = await this.paymentsService.findByInstallment(
      query.installmentId,
    );
    return items.map((p) => ({
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
      receiptUrl: p.receiptFileName
        ? `/uploads/${p.receiptFileName}`
        : undefined,
      notes: p.notes,
      createdBy: p.createdBy?.toString?.() || p.createdBy,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  }
}
