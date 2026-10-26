import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Request } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiAuth } from '../../common/decorators/api-auth.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ListInstallmentsDto, UpdateInstallmentDto, InstallmentResponseDto } from './dto/installment.dto';
import { ListInstallmentsQuery } from './queries/list-installments.query';
import { GetInstallmentsBySaleQuery } from './queries/get-installments-by-sale.query';
import { GetInstallmentByIdQuery } from './queries/get-installment-by-id.query';
import { UpdateInstallmentCommand } from './commands/update-installment.command';
import { InstallmentsService } from './installments.service';

@ApiTags('اقساط')
@ApiAuth()
@UseGuards(JwtAuthGuard)
@Controller('installments')
export class InstallmentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly installmentsService: InstallmentsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'لیست اقساط با فیلتر' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async list(
    @Query('page') page = 1,
    @Query('limit') limit = 50,
    @Query() filters: ListInstallmentsDto,
  ) {
    return this.queryBus.execute(new ListInstallmentsQuery(Number(page) || 1, Number(limit) || 50, filters));
  }

  @Get('by-sale/:saleId')
  @ApiOperation({ summary: 'لیست اقساط یک فروش' })
  async bySale(@Param('saleId') saleId: string): Promise<InstallmentResponseDto[]> {
    return this.queryBus.execute(new GetInstallmentsBySaleQuery(saleId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'دریافت جزئیات یک قسط' })
  async getById(@Param('id') id: string): Promise<InstallmentResponseDto> {
    return this.queryBus.execute(new GetInstallmentByIdQuery(id));
  }

  @Put(':id')
  @ApiOperation({ summary: 'به‌روزرسانی قسط (یادداشت/جریمه)' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateInstallmentDto,
    @CurrentUser('sub') actorId: string,
    @CurrentUser('username') actorName: string,
    @Req() req: Request,
  ): Promise<InstallmentResponseDto> {
    return this.commandBus.execute(
      new UpdateInstallmentCommand(id, dto, actorId, actorName, (req.headers['x-forwarded-for'] as string) || req.ip),
    );
  }

  @Post('refresh-late')
  @ApiOperation({ summary: 'بازمحاسبه روزهای عقب‌ماندگی همه اقساط' })
  async refreshLate() {
    return this.installmentsService.refreshLateDays();
  }
}
