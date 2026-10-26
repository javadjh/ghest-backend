import { PersianDate } from '@/common/utils/persian-date';

export interface SaleCalculationInput {
  purchasePrice: number; // مبلغ خرید
  salePrice: number; // مبلغ فروش
  downPayment: number; // پیش پرداخت
  installmentCount: number; // تعداد اقساط (می‌تواند اعشاری)
  monthlyProfitRate: number; // درصد سود ماهانه (مثلا ۵ = ۵٪)
  saleDate: string; // Jalali YYYY/MM/DD - تاریخ ثبت فروش
}

export interface InstallmentPlanItem {
  installmentNumber: number;
  dueDate: string; // Jalali YYYY/MM/DD
  monthKey: string; // YYYY/MM
  expectedAmount: number;
  monthLabel: string;
}

export interface SaleCalculationResult {
  loanAmount: number; // وام = فروش - پیش پرداخت
  totalProfit: number; // سود کلی = بازپرداخت - وام
  profitPerInstallment: number; // سود هر قسط
  repaymentAmount: number; // بازپرداخت = وام + سود کلی
  installmentAmount: number; // مبلغ هر قسط
  saleProfit: number; // سود فروش = فروش - خرید
  startMonth: string; // Jalali (اولین سررسید)
  endMonth: string; // Jalali (آخرین سررسید)
  installments: InstallmentPlanItem[];
}

/**
 * محاسبات فروش بر اساس روش صاحب فروشگاه:
 *  - وام = فروش - پیش پرداخت
 *  - سود ماهانه = وام × (درصد سود / ۱۰۰) × تعداد اقساط
 *  - بازپرداخت = وام + سود کلی
 *  - هر قسط = بازپرداخت / تعداد اقساط (با اعشار)
 *
 * نکته: صاحب فروشگاه تعداد اقساط اعشاری دارد (مثلا ۱.۵ یا ۲.۵)،
 * که نشان‌دهنده ماه ناقص است. ما هر قسط کامل را در یک ماه می‌اندازیم
 * و قسط آخر باقی‌مانده اعشار را شامل می‌شود.
 *
 * سررسید هر قسط: از تاریخ فروش یک ماه بعد از ماه N ام حساب می‌شود.
 */
export function calculateSale(input: SaleCalculationInput): SaleCalculationResult {
  const {
    purchasePrice,
    salePrice,
    downPayment,
    installmentCount,
    monthlyProfitRate,
    saleDate,
  } = input;

  if (purchasePrice < 0 || salePrice < 0 || downPayment < 0) {
    throw new Error('مبلغ‌ها نمی‌توانند منفی باشند');
  }
  if (installmentCount <= 0) {
    throw new Error('تعداد اقساط باید بزرگتر از صفر باشد');
  }
  if (downPayment > salePrice) {
    throw new Error('پیش پرداخت نمی‌تواند بیشتر از مبلغ فروش باشد');
  }

  const loanAmount = salePrice - downPayment; // وام
  const totalProfit = Math.round((loanAmount * monthlyProfitRate * installmentCount) / 100); // سود کلی
  const repaymentAmount = loanAmount + totalProfit; // بازپرداخت
  const profitPerInstallment = Math.round(totalProfit / installmentCount); // سود هر قسط (میانگین)
  const installmentAmount = Math.round(repaymentAmount / installmentCount); // هر قسط
  const saleProfit = salePrice - purchasePrice; // سود فروش

  // Build installment plan
  // We treat installmentCount as either integer or fractional
  // For each "month index" i (1..N), dueDate = saleDate + i months
  // The amount for the last fractional installment is the remainder

  const fullInstallments = Math.floor(installmentCount);
  const fractionalPart = installmentCount - fullInstallments; // e.g. 0.5
  const totalInstallmentsToCreate = fullInstallments + (fractionalPart > 0 ? 1 : 0);

  const installments: InstallmentPlanItem[] = [];

  // Compute amount per integer installment
  // If fractional, full installments = installmentAmount, last = remainder
  let remaining = repaymentAmount;
  for (let i = 1; i <= totalInstallmentsToCreate; i++) {
    const dueDate = PersianDate.addMonths(saleDate, i);
    const monthKey = PersianDate.monthKey(dueDate);
    const monthLabel = PersianDate.monthLabel(dueDate);

    let expected: number;
    if (i < totalInstallmentsToCreate) {
      // full installment
      expected = installmentAmount;
      if (i === totalInstallmentsToCreate - 1 && fractionalPart > 0) {
        // last full before fractional: actual full installment
        expected = installmentAmount;
      }
    } else {
      // last installment: the remainder
      expected = remaining - (i - 1) * installmentAmount;
      if (expected < 0) expected = 0;
    }
    installments.push({
      installmentNumber: i,
      dueDate,
      monthKey,
      expectedAmount: expected,
      monthLabel,
    });
  }

  // If installmentCount is integer (e.g., 6) we already produced N installments
  // with full = installmentAmount each and last possibly adjusted for rounding.
  // Use start = installments[0].dueDate, end = last.dueDate
  const startMonth = installments[0]?.dueDate || saleDate;
  const endMonth = installments[installments.length - 1]?.dueDate || saleDate;

  return {
    loanAmount,
    totalProfit,
    profitPerInstallment,
    repaymentAmount,
    installmentAmount,
    saleProfit,
    startMonth,
    endMonth,
    installments,
  };
}
