import { ICommand } from '@nestjs/cqrs';

export class DeleteUserCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly actorId: string,
    public readonly actorName: string,
    public readonly ip?: string,
  ) {}
}
