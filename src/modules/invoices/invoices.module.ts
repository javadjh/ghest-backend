import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { Sale, SaleSchema } from '../sales/schemas/sale.schema';
import { Installment, InstallmentSchema } from '../installments/schemas/installment.schema';
import { StoreInfo, StoreInfoSchema } from '../store-info/schemas/store-info.schema';
import { InvoicesController } from './invoices.controller';
import { GenerateInvoiceHandler } from './queries/generate-invoice.handler';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sale.name, schema: SaleSchema },
      { name: Installment.name, schema: InstallmentSchema },
      { name: StoreInfo.name, schema: StoreInfoSchema },
    ]),
    CqrsModule,
    LogsModule,
  ],
  controllers: [InvoicesController],
  providers: [GenerateInvoiceHandler],
})
export class InvoicesModule {}
