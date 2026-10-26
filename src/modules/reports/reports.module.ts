import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { Sale, SaleSchema } from '@/modules/sales/schemas/sale.schema';
import { Installment, InstallmentSchema } from '@/modules/installments/schemas/installment.schema';
import { Customer, CustomerSchema } from '@/modules/customers/schemas/customer.schema';
import { Payment, PaymentSchema } from '@/modules/payments/schemas/payment.schema';
import { ReportsController } from '@/modules/reports/reports.controller';
import { GetProfitReportHandler } from '@/modules/reports/queries/get-profit-report.handler';
import { GetMonthlyInstallmentsHandler } from '@/modules/reports/queries/get-monthly-installments.handler';
import { GetCustomerDebtReportHandler } from '@/modules/reports/queries/get-customer-debt-report.handler';
import { GetOverdueInstallmentsReportHandler } from '@/modules/reports/queries/get-overdue-installments-report.handler';
import { GetRealizedProfitPerSaleHandler } from '@/modules/reports/queries/get-realized-profit-per-sale.handler';

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
