import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { Sale, SaleSchema } from '@/modules/sales/schemas/sale.schema';
import { Installment, InstallmentSchema } from '@/modules/installments/schemas/installment.schema';
import { Customer, CustomerSchema } from '@/modules/customers/schemas/customer.schema';
import { Payment, PaymentSchema } from '@/modules/payments/schemas/payment.schema';
import { DashboardController } from '@/modules/dashboard/dashboard.controller';
import { GetDashboardStatsHandler } from '@/modules/dashboard/queries/get-dashboard-stats.handler';
import { GetMonthlyProfitChartHandler } from '@/modules/dashboard/queries/get-monthly-profit-chart.handler';
import { GetSalesStatusChartHandler } from '@/modules/dashboard/queries/get-sales-status-chart.handler';
import { GetPhoneProfitChartHandler } from '@/modules/dashboard/queries/get-phone-profit-chart.handler';
import { GetTopDebtCustomersHandler } from '@/modules/dashboard/queries/get-top-debt-customers.handler';

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
  controllers: [DashboardController],
  providers: [
    GetDashboardStatsHandler,
    GetMonthlyProfitChartHandler,
    GetSalesStatusChartHandler,
    GetPhoneProfitChartHandler,
    GetTopDebtCustomersHandler,
  ],
})
export class DashboardModule {}
