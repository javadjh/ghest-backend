import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty()
  @IsString()
  installmentId: string;

  @ApiProperty({ description: 'مبلغ پرداختی (تومان)' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'تاریخ پرداختی به سبک جلالی YYYY/MM/DD' })
  @IsString()
  paymentDate: string;

  @ApiProperty({ required: false, description: 'روش پرداخت (cash, bank, ...)' })
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ApiProperty({ required: false, description: 'شناسه فایل فیش آپلود شده' })
  @IsString()
  @IsOptional()
  receiptFileId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class PaymentResponseDto {
  id: string;
  saleId: string;
  installmentId: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  receiptFileId: string | null;
  receiptFileName: string;
  receiptOriginalName?: string;
  receiptUrl?: string;
  notes: string;
  createdBy: any;
  createdAt: Date;
  updatedAt: Date;
}

export class ListPaymentsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  saleId?: string;

  @ApiProperty({ required: false, description: 'تاریخ شروع جلالی YYYY/MM/DD' })
  @IsOptional()
  @IsString()
  fromDate?: string;

  @ApiProperty({ required: false, description: 'تاریخ پایان جلالی YYYY/MM/DD' })
  @IsOptional()
  @IsString()
  toDate?: string;
}
