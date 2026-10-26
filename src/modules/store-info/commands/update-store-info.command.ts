import { ICommand } from '@nestjs/cqrs';
import { UpdateStoreInfoDto } from '@/modules/store-info/dto/store-info.dto';

export class UpdateStoreInfoCommand implements ICommand {
  constructor(
    public readonly dto: UpdateStoreInfoDto,
    public readonly actorId: string,
    public readonly actorName: string,
    public readonly ip?: string,
  ) {}
}
