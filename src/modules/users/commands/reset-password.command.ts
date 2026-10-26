import { ICommand } from '@nestjs/cqrs';

export class ResetPasswordCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly newPassword: string,
    public readonly actorId: string,
    public readonly actorName: string,
    public readonly ip?: string,
  ) {}
}
