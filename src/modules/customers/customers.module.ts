import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { LogsModule } from '../logs/logs.module';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CreateCustomerHandler } from './commands/create-customer.handler';
import { UpdateCustomerHandler } from './commands/update-customer.handler';
import { DeleteCustomerHandler } from './commands/delete-customer.handler';
import { ListCustomersHandler } from './queries/list-customers.handler';
import { GetCustomerByIdHandler } from './queries/get-customer-by-id.handler';
import { Customer, CustomerSchema } from './schemas/customer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
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
