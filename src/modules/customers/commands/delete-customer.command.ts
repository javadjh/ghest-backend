import { ICommand } from '@nestjs/cqrs';

export class DeleteCustomerCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly actorId: string,
    public readonly actorName: string,
    public readonly ip?: string,
  ) {}
}
