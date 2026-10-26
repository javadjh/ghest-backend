import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { Sale, SaleSchema } from '../sales/schemas/sale.schema';
import { Installment, InstallmentSchema } from '../installments/schemas/installment.schema';
import { Customer, CustomerSchema } from '../customers/schemas/customer.schema';
import { Payment, PaymentSchema } from '../payments/schemas/payment.schema';
import { DashboardController } from './dashboard.controller';
import { GetDashboardStatsHandler } from './queries/get-dashboard-stats.handler';
import { GetMonthlyProfitChartHandler } from './queries/get-monthly-profit-chart.handler';
import { GetSalesStatusChartHandler } from './queries/get-sales-status-chart.handler';
import { GetPhoneProfitChartHandler } from './queries/get-phone-profit-chart.handler';
import { GetTopDebtCustomersHandler } from './queries/get-top-debt-customers.handler';

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
