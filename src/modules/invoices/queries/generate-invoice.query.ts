import { IQuery } from '@nestjs/cqrs';
import { InvoiceType } from '@/modules/invoices/dto/invoice.dto';

export class GenerateInvoiceQuery implements IQuery {
  constructor(
    public readonly saleId: string,
    public readonly type: InvoiceType,
  ) {}
}
