import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum InvoiceType {
  SALE = 'sale',
  INSTALLMENTS = 'installments',
}

export class InvoiceResponseDto {
  @ApiProperty()
  type: InvoiceType;

  @ApiProperty()
  saleId: string;

  @ApiProperty({ required: false })
  storeInfo: any;

  @ApiProperty({ required: false })
  sale: any;

  @ApiProperty({ required: false, type: [Object] })
  installments: any[];

  @ApiProperty({ required: false })
  totals: any;

  @ApiProperty({ required: false })
  invoiceNumber: string;

  @ApiProperty({ required: false })
  generatedAt: string;
}
