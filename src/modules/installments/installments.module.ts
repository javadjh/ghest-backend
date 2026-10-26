import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { Installment, InstallmentSchema } from '@/modules/installments/schemas/installment.schema';
import { InstallmentsService } from '@/modules/installments/installments.service';
import { InstallmentsController } from '@/modules/installments/installments.controller';
import { UpdateInstallmentHandler } from '@/modules/installments/commands/update-installment.handler';
import { ListInstallmentsHandler } from '@/modules/installments/queries/list-installments.handler';
import { GetInstallmentsBySaleHandler } from '@/modules/installments/queries/get-installments-by-sale.handler';
import { GetInstallmentByIdHandler } from '@/modules/installments/queries/get-installment-by-id.handler';
import { SalesModule } from '@/modules/sales/sales.module';
import { LogsModule } from '@/modules/logs/logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Installment.name, schema: InstallmentSchema }]),
    CqrsModule,
    SalesModule,
    LogsModule,
  ],
  controllers: [InstallmentsController],
  providers: [
    InstallmentsService,
    UpdateInstallmentHandler,
    ListInstallmentsHandler,
    GetInstallmentsBySaleHandler,
    GetInstallmentByIdHandler,
  ],
  exports: [InstallmentsService],
})
export class InstallmentsModule {}
