import { IQuery } from '@nestjs/cqrs';

export class GetInstallmentByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}
