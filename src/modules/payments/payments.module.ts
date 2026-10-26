import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { Payment, PaymentSchema } from '@/modules/payments/schemas/payment.schema';
import { Installment, InstallmentSchema } from '@/modules/installments/schemas/installment.schema';
import { Sale, SaleSchema } from '@/modules/sales/schemas/sale.schema';
import { PaymentsService } from '@/modules/payments/payments.service';
import { PaymentsController } from '@/modules/payments/payments.controller';
import { CreatePaymentHandler } from '@/modules/payments/commands/create-payment.handler';
import { DeletePaymentHandler } from '@/modules/payments/commands/delete-payment.handler';
import { ListPaymentsHandler } from '@/modules/payments/queries/list-payments.handler';
import { GetPaymentsByInstallmentHandler } from '@/modules/payments/queries/get-payments-by-installment.handler';
import { GetPaymentByIdHandler } from '@/modules/payments/queries/get-payment-by-id.handler';
import { FilesModule } from '@/modules/files/files.module';
import { LogsModule } from '@/modules/logs/logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Installment.name, schema: InstallmentSchema },
      { name: Sale.name, schema: SaleSchema },
    ]),
    CqrsModule,
    FilesModule,
    LogsModule,
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    CreatePaymentHandler,
    DeletePaymentHandler,
    ListPaymentsHandler,
    GetPaymentsByInstallmentHandler,
    GetPaymentByIdHandler,
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
