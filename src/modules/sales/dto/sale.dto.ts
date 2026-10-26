import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import {
  GuaranteeType,
  SaleStatus,
} from 'src/modules/sales/schemas/sale.schema';

export class GuaranteeDto {
  @ApiProperty({ enum: GuaranteeType, example: GuaranteeType.CHEQUE })
  @IsEnum(GuaranteeType)
  type: GuaranteeType;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  chequeNumber?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  chequeBank?: string;

  @ApiProperty({
    required: false,
    description: 'تاریخ چک به سبک جلالی YYYY/MM/DD',
  })
  @IsString()
  @IsOptional()
  chequeDate?: string;

  @ApiProperty({ required: false, type: Number })
  @IsNumber()
  @IsOptional()
  chequeAmount?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  goldType?: string;

  @ApiProperty({ required: false, type: Number })
  @IsNumber()
  @IsOptional()
  goldWeight?: number;

  @ApiProperty({ required: false, type: Number })
  @IsNumber()
  @IsOptional()
  goldKarat?: number;
}

export class CreateSaleDto {
  @ApiProperty({ description: 'شناسه مشتری' })
  @IsString()
  @MinLength(1)
  customerId: string;

  @ApiProperty({ example: 'Samsung Galaxy A17' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '357658253269181', required: false })
  @IsString()
  @IsOptional()
  imei?: string;

  @ApiProperty({
    example: '09123456789',
    required: false,
    description: 'شماره تماس مشتری روی این فروش',
  })
  @IsString()
  @IsOptional()
  phoneCustomer?: string;

  @ApiProperty({
    example: '1404/09/16',
    description: 'تاریخ فروش به سبک جلالی YYYY/MM/DD',
  })
  @IsString()
  saleDate: string;

  @ApiProperty({ example: 100_000_000 })
  @IsNumber()
  @Min(0)
  purchasePrice: number;

  @ApiProperty({ example: 110_000_000 })
  @IsNumber()
  @Min(0)
  salePrice: number;

  @ApiProperty({ example: 10_000_000 })
  @IsNumber()
  @Min(0)
  downPayment: number;

  @ApiProperty({
    example: 10,
    description: 'تعداد اقساط (می‌تواند اعشاری باشد مثل ۱.۵)',
  })
  @IsNumber()
  @Min(0.1)
  installmentCount: number;

  @ApiProperty({ example: 5, description: 'درصد سود ماهانه (مثلا ۵ = ۵٪)' })
  @IsNumber()
  @Min(0)
  monthlyProfitRate: number;

  @ApiProperty({ type: [GuaranteeDto], required: false, default: [] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => GuaranteeDto)
  guarantees?: GuaranteeDto[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateSaleDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  imei?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phoneCustomer?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  saleDate?: string;

  @ApiProperty({ required: false, type: Number })
  @IsNumber()
  @IsOptional()
  purchasePrice?: number;

  @ApiProperty({ required: false, type: Number })
  @IsNumber()
  @IsOptional()
  salePrice?: number;

  @ApiProperty({ required: false, type: Number })
  @IsNumber()
  @IsOptional()
  downPayment?: number;

  @ApiProperty({ required: false, type: Number })
  @IsNumber()
  @IsOptional()
  installmentCount?: number;

  @ApiProperty({ required: false, type: Number })
  @IsNumber()
  @IsOptional()
  monthlyProfitRate?: number;

  @ApiProperty({ required: false, type: [GuaranteeDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => GuaranteeDto)
  guarantees?: GuaranteeDto[];

  @ApiProperty({ enum: SaleStatus, required: false })
  @IsEnum(SaleStatus)
  @IsOptional()
  status?: SaleStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class SaleResponseDto {
  id: string;
  customerId: any;
  customerName: string;
  phone: string;
  imei: string;
  phoneCustomer: string;
  saleDate: string;
  purchasePrice: number;
  salePrice: number;
  downPayment: number;
  installmentCount: number;
  monthlyProfitRate: number;
  totalProfit: number;
  profitPerInstallment: number;
  repaymentAmount: number;
  installmentAmount: number;
  loanAmount: number;
  saleProfit: number;
  startMonth: string;
  endMonth: string;
  guarantees: any[];
  status: SaleStatus;
  notes: string;
  createdBy: any;
  totalPaid: number;
  remainingBalance: number;
  createdAt: Date;
  updatedAt: Date;
}
