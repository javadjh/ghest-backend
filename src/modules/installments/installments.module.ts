import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { Installment, InstallmentSchema } from './schemas/installment.schema';
import { InstallmentsService } from './installments.service';
import { InstallmentsController } from './installments.controller';
import { UpdateInstallmentHandler } from './commands/update-installment.handler';
import { ListInstallmentsHandler } from './queries/list-installments.handler';
import { GetInstallmentsBySaleHandler } from './queries/get-installments-by-sale.handler';
import { GetInstallmentByIdHandler } from './queries/get-installment-by-id.handler';
import { SalesModule } from '../sales/sales.module';
import { LogsModule } from '../logs/logs.module';

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
