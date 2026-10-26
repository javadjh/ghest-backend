import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { InstallmentStatus } from '../schemas/installment.schema';

export class InstallmentResponseDto {
  id: string;
  saleId: string;
  customerId: string;
  customerName: string;
  installmentNumber: number;
  dueDate: string;
  monthKey: string;
  expectedAmount: number;
  paidAmount: number;
  status: InstallmentStatus;
  paidDate: Date | null;
  notes: string;
  lateDays: number;
  penaltyAmount: number;
  paymentIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class ListInstallmentsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, enum: InstallmentStatus })
  @IsOptional()
  @IsEnum(InstallmentStatus)
  status?: InstallmentStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  saleId?: string;

  @ApiProperty({ required: false, description: 'کلید ماه جلالی YYYY/MM' })
  @IsOptional()
  @IsString()
  monthKey?: string;

  @ApiProperty({ required: false, description: 'سال جلالی (مثلا ۱۴۰۴)' })
  @IsOptional()
  @IsString()
  year?: string;

  @ApiProperty({ required: false, description: 'نام ماه فارسی (مهر، آبان و...)' })
  @IsOptional()
  @IsString()
  monthName?: string;

  @ApiProperty({ required: false, description: 'تنها اقساط معوق (گذشته)' })
  @IsOptional()
  @IsString()
  overdue?: string; // 'true'/'false'

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fromDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  toDate?: string;
}

export class UpdateInstallmentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  @Min(0)
  penaltyAmount?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  @Min(0)
  expectedAmount?: number;
}
