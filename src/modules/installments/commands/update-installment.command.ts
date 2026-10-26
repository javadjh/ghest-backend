import { ICommand } from '@nestjs/cqrs';
import { UpdateInstallmentDto } from '@/modules/installments/dto/installment.dto';

export class UpdateInstallmentCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateInstallmentDto,
    public readonly actorId: string,
    public readonly actorName: string,
    public readonly ip?: string,
  ) {}
}
