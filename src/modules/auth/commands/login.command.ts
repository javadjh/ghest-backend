import { ICommand } from '@nestjs/cqrs';

export class LoginCommand implements ICommand {
  constructor(
    public readonly username: string,
    public readonly password: string,
    public readonly ip?: string,
  ) {}
}
