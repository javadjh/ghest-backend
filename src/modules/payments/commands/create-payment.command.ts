import { ICommand } from '@nestjs/cqrs';
import { CreatePaymentDto } from '@/modules/payments/dto/payment.dto';

export class CreatePaymentCommand implements ICommand {
  constructor(
    public readonly dto: CreatePaymentDto,
    public readonly actorId: string,
    public readonly actorName: string,
    public readonly ip?: string,
  ) {}
}
