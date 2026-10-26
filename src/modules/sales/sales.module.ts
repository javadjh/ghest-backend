import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { Sale, SaleSchema } from './schemas/sale.schema';
import { Installment, InstallmentSchema } from '../installments/schemas/installment.schema';
import { Customer, CustomerSchema } from '../customers/schemas/customer.schema';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { CreateSaleHandler } from './commands/create-sale.handler';
import { UpdateSaleHandler } from './commands/update-sale.handler';
import { DeleteSaleHandler } from './commands/delete-sale.handler';
import { ListSalesHandler } from './queries/list-sales.handler';
import { GetSaleByIdHandler } from './queries/get-sale-by-id.handler';
import { LogsModule } from '../logs/logs.module';

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
