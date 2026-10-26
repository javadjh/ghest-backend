import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { CreatePaymentDto, ListPaymentsDto, PaymentResponseDto } from './dto/payment.dto';
import { CreatePaymentCommand } from './commands/create-payment.command';
import { DeletePaymentCommand } from './commands/delete-payment.command';
import { ListPaymentsQuery } from './queries/list-payments.query';
import { GetPaymentByIdQuery } from './queries/get-payment-by-id.query';
import { GetPaymentsByInstallmentQuery } from './queries/get-payments-by-installment.query';

@ApiTags('پرداختی‌ها')
@ApiAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'لیست پرداختی‌ها' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async list(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query() filters: ListPaymentsDto,
  ) {
    return this.queryBus.execute(new ListPaymentsQuery(Number(page) || 1, Number(limit) || 20, filters));
  }

  @Get('by-installment/:installmentId')
  @ApiOperation({ summary: 'پرداختی‌های یک قسط' })
  async byInstallment(@Param('installmentId') installmentId: string): Promise<PaymentResponseDto[]> {
    return this.queryBus.execute(new GetPaymentsByInstallmentQuery(installmentId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'دریافت جزئیات یک پرداختی' })
  async getById(@Param('id') id: string): Promise<PaymentResponseDto> {
    return this.queryBus.execute(new GetPaymentByIdQuery(id));
  }

  @Post()
  @ApiOperation({ summary: 'ثبت پرداختی برای قسط (به همراه فیش اختیاری)' })
  async create(
    @Body() dto: CreatePaymentDto,
    @CurrentUser('sub') actorId: string,
    @CurrentUser('username') actorName: string,
    @Req() req: Request,
  ): Promise<PaymentResponseDto> {
    return this.commandBus.execute(
      new CreatePaymentCommand(dto, actorId, actorName, (req.headers['x-forwarded-for'] as string) || req.ip),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف پرداختی (قسط برمی‌گردد)' })
  async delete(
    @Param('id') id: string,
    @CurrentUser('sub') actorId: string,
    @CurrentUser('username') actorName: string,
    @Req() req: Request,
  ): Promise<void> {
    return this.commandBus.execute(
      new DeletePaymentCommand(id, actorId, actorName, (req.headers['x-forwarded-for'] as string) || req.ip),
    );
  }
}
