import { ICommand } from '@nestjs/cqrs';
import { CreateUserDto } from 'src/modules/users/dto/user.dto';

export class CreateUserCommand implements ICommand {
  constructor(
    public readonly dto: CreateUserDto,
    public readonly actorId: string,
    public readonly actorName: string,
    public readonly ip?: string,
  ) {}
}
