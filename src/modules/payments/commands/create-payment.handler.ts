import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Injectable } from "@nestjs/common";
import { CreatePaymentCommand } from "./create-payment.command";
import { PaymentsService } from "../payments.service";
import { AppLoggerService } from "../../../common/utils/app-logger.service";
import { LogAction } from "../../logs/schemas/log.schema";
import { PaymentResponseDto } from "../dto/payment.dto";

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentHandler implements ICommandHandler<
  CreatePaymentCommand,
  PaymentResponseDto
> {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly logger: AppLoggerService,
  ) {}

  async execute(cmd: CreatePaymentCommand): Promise<PaymentResponseDto> {
    const payment = await this.paymentsService.create(cmd.dto, cmd.actorId);
    await this.logger.log({
      action: LogAction.PAYMENT,
      entity: "Payment",
      entityId: (payment._id as any).toString(),
      description: `ثبت پرداختی ${payment.amount} برای مشتری ${payment.customerName} در تاریخ ${payment.paymentDate}`,
      userId: cmd.actorId,
      username: cmd.actorName,
      ip: cmd.ip,
      details: {
        installmentId: payment.installmentId.toString(),
        amount: payment.amount,
      },
    });
    return this.toDto(payment);
  }

  private toDto(payment: any): PaymentResponseDto {
    return {
      id: (payment._id as any).toString(),
      saleId: payment.saleId.toString(),
      installmentId: payment.installmentId.toString(),
      customerId: payment.customerId.toString(),
      customerName: payment.customerName,
      amount: payment.amount,
      paymentDate: payment.paymentDate,
      paymentMethod: payment.paymentMethod,
      receiptFileId: payment.receiptFileId?.toString?.() || null,
      receiptFileName: payment.receiptFileName,
      receiptOriginalName:
        payment.receiptOriginalName || payment.receiptFileName,
      receiptUrl: payment.receiptFileName
        ? `/uploads/${payment.receiptFileName}`
        : undefined,
      notes: payment.notes,
      createdBy: payment.createdBy?.toString?.() || payment.createdBy,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
}
