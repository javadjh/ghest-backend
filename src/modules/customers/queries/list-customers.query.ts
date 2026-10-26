import { IQuery } from '@nestjs/cqrs';

export class ListCustomersQuery implements IQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 20,
    public readonly search?: string,
  ) {}
}
