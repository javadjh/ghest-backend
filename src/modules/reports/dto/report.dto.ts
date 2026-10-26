import { ApiProperty } from '@nestjs/swagger';

export class ProfitByPeriodDto {
  period: 'daily' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  totalRevenue: number;
  totalPurchase: number;
  totalExpectedProfit: number;
  totalRealizedProfit: number;
  totalPaid: number;
  salesCount: number;
}

export class ProfitByMonthItem {
  monthKey: string;
  monthLabel: string;
  revenue: number;
  purchase: number;
  expectedProfit: number;
  realizedProfit: number;
  paidAmount: number;
}

export class CustomerDebtDto {
  customerId: string;
  customerName: string;
  phone: string;
  totalRepayment: number;
  totalPaid: number;
  totalRemaining: number;
  activeSalesCount: number;
  installmentsCount: number;
  overdueInstallments: number;
  overdueAmount: number;
}

export class OverdueInstallmentDto {
  installmentId: string;
  saleId: string;
  customerId: string;
  customerName: string;
  phone: string;
  installmentNumber: number;
  dueDate: string;
  monthKey: string;
  expectedAmount: number;
  paidAmount: number;
  remaining: number;
  lateDays: number;
  penaltyAmount: number;
  phoneCustomer: string;
}

export class MonthlyInstallmentsListDto {
  monthKey: string;
  monthLabel: string;
  customerName: string;
  phone: string;
  installmentNumber: number;
  expectedAmount: number;
  paidAmount: number;
  status: string;
  paidDate: string | null;
  lateDays: number;
  customerId: string;
  saleId: string;
}

export class RealizedProfitPerSaleDto {
  saleId: string;
  customerName: string;
  phone: string;
  saleDate: string;
  repaymentAmount: number;
  totalPaid: number;
  totalProfit: number;
  realizedProfit: number;
  remainingProfit: number;
  completionRatio: number;
}
