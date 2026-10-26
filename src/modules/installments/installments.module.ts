import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import {
  Installment,
  InstallmentSchema,
} from 'src/modules/installments/schemas/installment.schema';
import { InstallmentsService } from 'src/modules/installments/installments.service';
import { InstallmentsController } from 'src/modules/installments/installments.controller';
import { UpdateInstallmentHandler } from 'src/modules/installments/commands/update-installment.handler';
import { ListInstallmentsHandler } from 'src/modules/installments/queries/list-installments.handler';
import { GetInstallmentsBySaleHandler } from 'src/modules/installments/queries/get-installments-by-sale.handler';
import { GetInstallmentByIdHandler } from 'src/modules/installments/queries/get-installment-by-id.handler';
import { SalesModule } from 'src/modules/sales/sales.module';
import { LogsModule } from 'src/modules/logs/logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Installment.name, schema: InstallmentSchema },
    ]),
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
