import { IQuery } from '@nestjs/cqrs';
import { InvoiceType } from 'src/modules/invoices/dto/invoice.dto';

export class GenerateInvoiceQuery implements IQuery {
  constructor(
    public readonly saleId: string,
    public readonly type: InvoiceType,
  ) {}
}
