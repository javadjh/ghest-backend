import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LogAction } from '../schemas/log.schema';

export class ListLogsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, enum: LogAction })
  @IsOptional()
  @IsEnum(LogAction)
  action?: LogAction;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  entity?: string;

  @ApiProperty({
    required: false,
    description: 'تاریخ شروع به سبک جلالی YYYY/MM/DD',
  })
  @IsOptional()
  @IsString()
  fromDate?: string;

  @ApiProperty({
    required: false,
    description: 'تاریخ پایان به سبک جلالی YYYY/MM/DD',
  })
  @IsOptional()
  @IsString()
  toDate?: string;
}

export class LogResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty({ enum: LogAction })
  action: LogAction;
  @ApiProperty()
  entity: string;
  @ApiProperty()
  entityId: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  ip: string;
  @ApiProperty()
  details: any;
  @ApiProperty()
  timestamp: Date;
}
