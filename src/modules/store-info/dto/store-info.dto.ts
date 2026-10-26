import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateStoreInfoDto {
  @ApiProperty({ required: false, example: 'فروشگاه موبایل آرش' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  owner?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  taxId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  economicCode?: string;

  @ApiProperty({ required: false, description: 'مسیر لوگو' })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  footerNote?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  invoicePrefix?: string;
}

export class StoreInfoResponseDto {
  id: string;
  name: string;
  owner: string;
  phone: string;
  address: string;
  taxId: string;
  economicCode: string;
  logo: string;
  footerNote: string;
  invoicePrefix: string;
}
