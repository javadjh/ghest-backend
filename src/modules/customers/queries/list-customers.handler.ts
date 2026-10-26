import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListCustomersQuery } from './list-customers.query';
import { CustomerResponseDto } from '../dto/customer.dto';
import { CustomersService } from '../customers.service';

@QueryHandler(ListCustomersQuery)
export class ListCustomersHandler implements IQueryHandler<
  ListCustomersQuery,
  { items: CustomerResponseDto[]; total: number; page: number; limit: number }
> {
  constructor(private readonly customersService: CustomersService) {}

  async execute(
    query: ListCustomersQuery,
  ): Promise<{
    items: CustomerResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { items, total } = await this.customersService.list(
      query.page,
      query.limit,
      query.search,
    );
    return {
      items: items.map((c) => ({
        id: (c._id as any).toString(),
        fullName: c.fullName,
        phone: c.phone,
        nationalId: c.nationalId,
        address: c.address,
        notes: c.notes,
        totalPurchases: c.totalPurchases,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
      total,
      page: query.page,
      limit: query.limit,
    };
  }
}
