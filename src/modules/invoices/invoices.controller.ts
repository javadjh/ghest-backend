import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { Request } from 'express';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ApiAuth } from '@/common/decorators/api-auth.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { GenerateInvoiceQuery } from '@/modules/invoices/queries/generate-invoice.query';
import { InvoiceType } from '@/modules/invoices/dto/invoice.dto';
import { AppLoggerService } from '@/common/utils/app-logger.service';
import { LogAction } from '@/modules/logs/schemas/log.schema';

@ApiTags('فاکتور')
@ApiAuth()
@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly logger: AppLoggerService,
  ) {}

  @Get(':saleId')
  @ApiOperation({ summary: 'صدور فاکتور برای فروش (با اقساط)' })
  async generate(
    @Param('saleId') saleId: string,
    @Query('type') type: 'sale' | 'installments' = 'sale',
    @CurrentUser('sub') userId: string,
    @CurrentUser('username') username: string,
    @Req() req: Request,
  ) {
    const result = await this.queryBus.execute(
      new GenerateInvoiceQuery(saleId, (type as InvoiceType) || InvoiceType.SALE),
    );
    await this.logger.log({
      action: LogAction.PRINT,
      entity: 'Invoice',
      entityId: saleId,
      description: `صدور فاکتور ${type === 'installments' ? 'اقساط' : 'فروش'} برای فروش ${saleId}`,
      userId,
      username,
      ip: (req.headers['x-forwarded-for'] as string) || req.ip,
    });
    return result;
  }
}
