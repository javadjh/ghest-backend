import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiAuth } from 'src/common/decorators/api-auth.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  CreateSaleDto,
  UpdateSaleDto,
  SaleResponseDto,
} from 'src/modules/sales/dto/sale.dto';
import { CreateSaleCommand } from 'src/modules/sales/commands/create-sale.command';
import { UpdateSaleCommand } from 'src/modules/sales/commands/update-sale.command';
import { DeleteSaleCommand } from 'src/modules/sales/commands/delete-sale.command';
import { ListSalesQuery } from 'src/modules/sales/queries/list-sales.query';
import { GetSaleByIdQuery } from 'src/modules/sales/queries/get-sale-by-id.query';

@ApiTags('فروش‌ها')
@ApiAuth()
@UseGuards(JwtAuthGuard)
@Controller('sales')
export class SalesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'لیست فروش‌ها با فیلتر' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiQuery({ name: 'phoneModel', required: false })
  @ApiQuery({ name: 'fromDate', required: false })
  @ApiQuery({ name: 'toDate', required: false })
  async list(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('customerId') customerId?: string,
    @Query('phoneModel') phoneModel?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.queryBus.execute(
      new ListSalesQuery(Number(page) || 1, Number(limit) || 20, {
        search,
        status,
        customerId,
        phoneModel,
        fromDate,
        toDate,
      }),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'دریافت جزئیات یک فروش' })
  async getById(@Param('id') id: string): Promise<SaleResponseDto> {
    return this.queryBus.execute(new GetSaleByIdQuery(id));
  }

  @Post()
  @ApiOperation({ summary: 'ثبت فروش جدید (اقساط خودکار تولید می‌شوند)' })
  async create(
    @Body() dto: CreateSaleDto,
    @CurrentUser('sub') actorId: string,
    @CurrentUser('username') actorName: string,
    @Req() req: Request,
  ): Promise<SaleResponseDto> {
    return this.commandBus.execute(
      new CreateSaleCommand(
        dto,
        actorId,
        actorName,
        (req.headers['x-forwarded-for'] as string) || req.ip,
      ),
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'به‌روزرسانی فروش' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSaleDto,
    @CurrentUser('sub') actorId: string,
    @CurrentUser('username') actorName: string,
    @Req() req: Request,
  ): Promise<SaleResponseDto> {
    return this.commandBus.execute(
      new UpdateSaleCommand(
        id,
        dto,
        actorId,
        actorName,
        (req.headers['x-forwarded-for'] as string) || req.ip,
      ),
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'حذف فروش (اقساط و پرداختی‌های مربوطه نیز حذف می‌شوند)',
  })
  async delete(
    @Param('id') id: string,
    @CurrentUser('sub') actorId: string,
    @CurrentUser('username') actorName: string,
    @Req() req: Request,
  ): Promise<void> {
    return this.commandBus.execute(
      new DeleteSaleCommand(
        id,
        actorId,
        actorName,
        (req.headers['x-forwarded-for'] as string) || req.ip,
      ),
    );
  }
}
