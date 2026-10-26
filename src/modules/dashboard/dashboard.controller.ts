import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiAuth } from 'src/common/decorators/api-auth.decorator';
import { GetDashboardStatsQuery } from 'src/modules/dashboard/queries/get-dashboard-stats.query';
import { GetMonthlyProfitChartQuery } from 'src/modules/dashboard/queries/get-monthly-profit-chart.query';
import { GetSalesStatusChartQuery } from 'src/modules/dashboard/queries/get-sales-status-chart.query';
import { GetPhoneProfitChartQuery } from 'src/modules/dashboard/queries/get-phone-profit-chart.query';
import { GetTopDebtCustomersQuery } from 'src/modules/dashboard/queries/get-top-debt-customers.query';

@ApiTags('داشبورد')
@ApiAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('stats')
  @ApiOperation({ summary: 'آمار کلی داشبورد' })
  async stats() {
    return this.queryBus.execute(new GetDashboardStatsQuery());
  }

  @Get('monthly-profit')
  @ApiOperation({ summary: 'نمودار سود ماهانه' })
  @ApiQuery({
    name: 'monthsBack',
    required: false,
    description: 'تعداد ماه‌های گذشته (پیش‌فرض ۱۲)',
  })
  async monthly(@Query('monthsBack') monthsBack = 12) {
    return this.queryBus.execute(
      new GetMonthlyProfitChartQuery(Number(monthsBack) || 12),
    );
  }

  @Get('sales-status')
  @ApiOperation({ summary: 'نمودار وضعیت فروش‌ها' })
  async salesStatus() {
    return this.queryBus.execute(new GetSalesStatusChartQuery());
  }

  @Get('phone-profit')
  @ApiOperation({ summary: 'سود به تفکیک مدل گوشی' })
  @ApiQuery({ name: 'limit', required: false })
  async phoneProfit(@Query('limit') limit = 10) {
    return this.queryBus.execute(
      new GetPhoneProfitChartQuery(Number(limit) || 10),
    );
  }

  @Get('top-debt')
  @ApiOperation({ summary: 'مشتریان با بیشترین بدهی' })
  @ApiQuery({ name: 'limit', required: false })
  async topDebt(@Query('limit') limit = 10) {
    return this.queryBus.execute(
      new GetTopDebtCustomersQuery(Number(limit) || 10),
    );
  }
}
