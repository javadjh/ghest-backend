import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { Sale, SaleSchema } from 'src/modules/sales/schemas/sale.schema';
import {
  Installment,
  InstallmentSchema,
} from 'src/modules/installments/schemas/installment.schema';
import {
  StoreInfo,
  StoreInfoSchema,
} from 'src/modules/store-info/schemas/store-info.schema';
import { InvoicesController } from 'src/modules/invoices/invoices.controller';
import { GenerateInvoiceHandler } from 'src/modules/invoices/queries/generate-invoice.handler';
import { LogsModule } from 'src/modules/logs/logs.module';

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
