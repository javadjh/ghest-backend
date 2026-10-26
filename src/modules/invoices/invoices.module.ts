import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { Sale, SaleSchema } from '@/modules/sales/schemas/sale.schema';
import { Installment, InstallmentSchema } from '@/modules/installments/schemas/installment.schema';
import { StoreInfo, StoreInfoSchema } from '@/modules/store-info/schemas/store-info.schema';
import { InvoicesController } from '@/modules/invoices/invoices.controller';
import { GenerateInvoiceHandler } from '@/modules/invoices/queries/generate-invoice.handler';
import { LogsModule } from '@/modules/logs/logs.module';

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
