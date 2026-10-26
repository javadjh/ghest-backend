import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { Sale, SaleSchema } from 'src/modules/sales/schemas/sale.schema';
import {
  Installment,
  InstallmentSchema,
} from 'src/modules/installments/schemas/installment.schema';
import {
  Customer,
  CustomerSchema,
} from 'src/modules/customers/schemas/customer.schema';
import {
  Payment,
  PaymentSchema,
} from 'src/modules/payments/schemas/payment.schema';
import { DashboardController } from 'src/modules/dashboard/dashboard.controller';
import { GetDashboardStatsHandler } from 'src/modules/dashboard/queries/get-dashboard-stats.handler';
import { GetMonthlyProfitChartHandler } from 'src/modules/dashboard/queries/get-monthly-profit-chart.handler';
import { GetSalesStatusChartHandler } from 'src/modules/dashboard/queries/get-sales-status-chart.handler';
import { GetPhoneProfitChartHandler } from 'src/modules/dashboard/queries/get-phone-profit-chart.handler';
import { GetTopDebtCustomersHandler } from 'src/modules/dashboard/queries/get-top-debt-customers.handler';

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
