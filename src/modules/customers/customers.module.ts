import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { Customer, CustomerSchema } from '@/modules/customers/schemas/customer.schema';
import { CustomersService } from '@/modules/customers/customers.service';
import { CustomersController } from '@/modules/customers/customers.controller';
import { CreateCustomerHandler } from '@/modules/customers/commands/create-customer.handler';
import { UpdateCustomerHandler } from '@/modules/customers/commands/update-customer.handler';
import { DeleteCustomerHandler } from '@/modules/customers/commands/delete-customer.handler';
import { ListCustomersHandler } from '@/modules/customers/queries/list-customers.handler';
import { GetCustomerByIdHandler } from '@/modules/customers/queries/get-customer-by-id.handler';
import { LogsModule } from '@/modules/logs/logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]),
    CqrsModule,
    LogsModule,
  ],
  controllers: [CustomersController],
  providers: [
    CustomersService,
    CreateCustomerHandler,
    UpdateCustomerHandler,
    DeleteCustomerHandler,
    ListCustomersHandler,
    GetCustomerByIdHandler,
  ],
  exports: [CustomersService],
})
export class CustomersModule {}
