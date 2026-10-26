import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { Sale, SaleSchema } from '../sales/schemas/sale.schema';
import { Installment, InstallmentSchema } from '../installments/schemas/installment.schema';
import { Customer, CustomerSchema } from '../customers/schemas/customer.schema';
import { Payment, PaymentSchema } from '../payments/schemas/payment.schema';
import { ReportsController } from './reports.controller';
import { GetProfitReportHandler } from './queries/get-profit-report.handler';
import { GetMonthlyInstallmentsHandler } from './queries/get-monthly-installments.handler';
import { GetCustomerDebtReportHandler } from './queries/get-customer-debt-report.handler';
import { GetOverdueInstallmentsReportHandler } from './queries/get-overdue-installments-report.handler';
import { GetRealizedProfitPerSaleHandler } from './queries/get-realized-profit-per-sale.handler';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sale.name, schema: SaleSchema },
      { name: Installment.name, schema: InstallmentSchema },
      { name: Customer.name, schema: CustomerSchema },
      { name: Payment.name, schema: PaymentSchema },
    ]),
    CqrsModule,
  ],
  controllers: [ReportsController],
  providers: [
    GetProfitReportHandler,
    GetMonthlyInstallmentsHandler,
    GetCustomerDebtReportHandler,
    GetOverdueInstallmentsReportHandler,
    GetRealizedProfitPerSaleHandler,
  ],
})
export class ReportsModule {}
