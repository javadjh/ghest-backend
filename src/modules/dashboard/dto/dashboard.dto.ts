import { ApiProperty } from '@nestjs/swagger';

export class DashboardStatsDto {
  @ApiProperty()
  totalSales: number;
  @ApiProperty()
  totalActiveSales: number;
  @ApiProperty()
  totalCustomers: number;
  @ApiProperty()
  totalRevenue: number; // جمع مبالغ فروش
  @ApiProperty()
  totalPurchase: number; // جمع مبالغ خرید
  @ApiProperty()
  totalProfit: number; // سود انتظاری کل
  @ApiProperty()
  totalRealizedProfit: number; // سود محقق‌شده
  @ApiProperty()
  totalOutstanding: number; // مانده بدهی همه اقساط
  @ApiProperty()
  totalPenalty: number; // جمع جریمه‌ها
  @ApiProperty()
  overdueInstallmentsCount: number;
  @ApiProperty()
  overdueAmount: number;
  @ApiProperty()
  todayPayments: number;
  @ApiProperty()
  todayPaymentsCount: number;
  @ApiProperty()
  thisMonthProfit: number;
  @ApiProperty()
  thisMonthInstallmentsCount: number;
}

export class MonthlyProfitChartItem {
  monthKey: string;
  monthLabel: string;
  profit: number;
  installmentCount: number;
  expectedAmount: number;
  paidAmount: number;
}

export class SalesStatusChartItem {
  status: string;
  count: number;
}

export class PhoneProfitChartItem {
  phoneModel: string;
  count: number;
  totalProfit: number;
  totalSale: number;
}

export class TopDebtCustomerDto {
  customerId: string;
  customerName: string;
  totalDebt: number;
  activeSalesCount: number;
}
