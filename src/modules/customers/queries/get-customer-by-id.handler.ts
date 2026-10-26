import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { GetCustomerByIdQuery } from './get-customer-by-id.query';
import { CustomerResponseDto } from '../dto/customer.dto';
import { CustomersService } from '../customers.service';

@QueryHandler(GetCustomerByIdQuery)
export class GetCustomerByIdHandler implements IQueryHandler<
  GetCustomerByIdQuery,
  CustomerResponseDto
> {
  constructor(private readonly customersService: CustomersService) {}

  async execute(query: GetCustomerByIdQuery): Promise<CustomerResponseDto> {
    const c = await this.customersService.findById(query.id);
    if (!c) throw new NotFoundException('مشتری یافت نشد');
    return {
      id: (c._id as any).toString(),
      fullName: c.fullName,
      phone: c.phone,
      nationalId: c.nationalId,
      address: c.address,
      notes: c.notes,
      totalPurchases: c.totalPurchases,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    };
  }
}
