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
import { SalesService } from 'src/modules/sales/sales.service';
import { SalesController } from 'src/modules/sales/sales.controller';
import { CreateSaleHandler } from 'src/modules/sales/commands/create-sale.handler';
import { UpdateSaleHandler } from 'src/modules/sales/commands/update-sale.handler';
import { DeleteSaleHandler } from 'src/modules/sales/commands/delete-sale.handler';
import { ListSalesHandler } from 'src/modules/sales/queries/list-sales.handler';
import { GetSaleByIdHandler } from 'src/modules/sales/queries/get-sale-by-id.handler';
import { LogsModule } from 'src/modules/logs/logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sale.name, schema: SaleSchema },
      { name: Installment.name, schema: InstallmentSchema },
      { name: Customer.name, schema: CustomerSchema },
    ]),
    CqrsModule,
    LogsModule,
  ],
  controllers: [SalesController],
  providers: [
    SalesService,
    CreateSaleHandler,
    UpdateSaleHandler,
    DeleteSaleHandler,
    ListSalesHandler,
    GetSaleByIdHandler,
  ],
  exports: [SalesService],
})
export class SalesModule {}
