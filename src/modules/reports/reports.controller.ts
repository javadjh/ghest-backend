import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiAuth } from '../../common/decorators/api-auth.decorator';
import { GetProfitReportQuery } from './queries/get-profit-report.query';
import { GetMonthlyInstallmentsQuery } from './queries/get-monthly-installments.query';
import { GetCustomerDebtReportQuery } from './queries/get-customer-debt-report.query';
import { GetOverdueInstallmentsReportQuery } from './queries/get-overdue-installments-report.query';
import { GetRealizedProfitPerSaleQuery } from './queries/get-realized-profit-per-sale.query';
import { PersianDate } from '../../common/utils/persian-date';

@ApiTags('گزارش‌ها')
@ApiAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('profit')
  @ApiOperation({ summary: 'گزارش سود در بازه زمانی (روزانه/ماهانه/سالانه)' })
  @ApiQuery({ name: 'startDate', required: true, description: 'تاریخ شروع جلالی YYYY/MM/DD' })
  @ApiQuery({ name: 'endDate', required: true, description: 'تاریخ پایان جلالی YYYY/MM/DD' })
  @ApiQuery({ name: 'period', required: false, enum: ['daily', 'monthly', 'yearly'] })
  async profit(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('period') period: 'daily' | 'monthly' | 'yearly' = 'monthly',
  ) {
    return this.queryBus.execute(new GetProfitReportQuery(startDate, endDate, period));
  }

  @Get('monthly-installments')
  @ApiOperation({ summary: 'لیست اقساط یک ماه خاص (مهر/آبان/...)' })
  @ApiQuery({ name: 'monthKey', required: false, description: 'کلید ماه YYYY/MM (پیش‌فرض ماه جاری)' })
  async monthly(@Query('monthKey') monthKey?: string) {
    return this.queryBus.execute(new GetMonthlyInstallmentsQuery(monthKey));
  }

  @Get('customer-debt')
  @ApiOperation({ summary: 'گزارش بدهی مشتریان' })
  @ApiQuery({ name: 'customerId', required: false })
  async customerDebt(@Query('customerId') customerId?: string) {
    return this.queryBus.execute(new GetCustomerDebtReportQuery(customerId));
  }

  @Get('overdue')
  @ApiOperation({ summary: 'اقساط معوق (سررسید گذشته و تسویه نشده)' })
  async overdue() {
    return this.queryBus.execute(new GetOverdueInstallmentsReportQuery());
  }

  @Get('realized-profit')
  @ApiOperation({ summary: 'سود محقق‌شده به تفکیک هر فروش' })
  async realized() {
    return this.queryBus.execute(new GetRealizedProfitPerSaleQuery());
  }

  @Get('current-month-key')
  @ApiOperation({ summary: 'دریافت کلید ماه جاری' })
  currentMonthKey() {
    return { monthKey: PersianDate.currentMonthKey(), monthLabel: PersianDate.monthLabel(PersianDate.now()) };
  }
}
