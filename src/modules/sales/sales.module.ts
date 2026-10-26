import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { Sale, SaleSchema } from '@/modules/sales/schemas/sale.schema';
import { Installment, InstallmentSchema } from '@/modules/installments/schemas/installment.schema';
import { Customer, CustomerSchema } from '@/modules/customers/schemas/customer.schema';
import { SalesService } from '@/modules/sales/sales.service';
import { SalesController } from '@/modules/sales/sales.controller';
import { CreateSaleHandler } from '@/modules/sales/commands/create-sale.handler';
import { UpdateSaleHandler } from '@/modules/sales/commands/update-sale.handler';
import { DeleteSaleHandler } from '@/modules/sales/commands/delete-sale.handler';
import { ListSalesHandler } from '@/modules/sales/queries/list-sales.handler';
import { GetSaleByIdHandler } from '@/modules/sales/queries/get-sale-by-id.handler';
import { LogsModule } from '@/modules/logs/logs.module';

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
