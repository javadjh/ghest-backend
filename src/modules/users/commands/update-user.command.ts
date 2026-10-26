import { ICommand } from '@nestjs/cqrs';
import { UpdateUserDto } from '../dto/user.dto';

export class UpdateUserCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateUserDto,
    public readonly actorId: string,
    public readonly actorName: string,
    public readonly ip?: string,
  ) {}
}
