import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { Installment, InstallmentSchema } from '../installments/schemas/installment.schema';
import { Sale, SaleSchema } from '../sales/schemas/sale.schema';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { CreatePaymentHandler } from './commands/create-payment.handler';
import { DeletePaymentHandler } from './commands/delete-payment.handler';
import { ListPaymentsHandler } from './queries/list-payments.handler';
import { GetPaymentsByInstallmentHandler } from './queries/get-payments-by-installment.handler';
import { GetPaymentByIdHandler } from './queries/get-payment-by-id.handler';
import { FilesModule } from '../files/files.module';
import { LogsModule } from '../logs/logs.module';

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
