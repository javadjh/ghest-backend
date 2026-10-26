import dayjs from 'dayjs';
// @ts-ignore
import jalaliday from 'jalaliday';
import 'dayjs/locale/fa';

// بارگذاری پلاگین jalaliday
const jalaliPlugin = (jalaliday as any)?.default || jalaliday;
(dayjs as any).extend(jalaliPlugin);
(dayjs as any).locale('fa');

const persianMonths = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

// هلپر ایجاد اینستنس با تقویم جلالی برای جلوگیری از خطای overload تایپ‌اسکریپت
function makeJalali(dateInput?: any) {
  if (typeof dateInput === 'string' && /^\d{4}[\/\-]/.test(dateInput)) {
    // پارس تاریخ رشته‌ای جلالی
    return (dayjs as any)(dateInput, { jalali: true }).calendar('jalali');
  }
  return (dayjs as any)(dateInput).calendar('jalali');
}

export class PersianDate {
  /**
   * تبدیل تاریخ میلادی به رشته جلالی 'YYYY/MM/DD'
   */
  static toJalali(date: Date | string | number): string {
    return (dayjs as any)(date).calendar('jalali').format('YYYY/MM/DD');
  }

  /**
   * تبدیل رشته جلالی 'YYYY/MM/DD' به شیء Date میلادی
   */
  static toGregorian(jalali: string): Date {
    return makeJalali(jalali).toDate();
  }

  /**
   * فرمت تاریخ جلالی با نام ماه فارسی (مثلاً ۲۵ مهر ۱۴۰۳)
   */
  static formatJalali(date: Date | string | number): string {
    return (dayjs as any)(date).calendar('jalali').format('D MMMM YYYY');
  }

  /**
   * دریافت تاریخ جلالی امروز 'YYYY/MM/DD'
   */
  static now(): string {
    return (dayjs as any)().calendar('jalali').format('YYYY/MM/DD');
  }

  /**
   * تایم‌استمپ کامل جلالی فعلی 'YYYY/MM/DD HH:mm:ss'
   */
  static nowTimestamp(): string {
    return (dayjs as any)().calendar('jalali').format('YYYY/MM/DD HH:mm:ss');
  }

  /**
   * افزودن N ماه به یک تاریخ جلالی
   */
  static addMonths(jalali: string, months: number): string {
    return makeJalali(jalali).add(months, 'month').format('YYYY/MM/DD');
  }

  /**
   * نام ماه فارسی (شماره ۱ تا ۱۲)
   */
  static monthName(month: number): string {
    return persianMonths[month - 1] || '';
  }

  /**
   * نام ماه فارسی بر اساس یک رشته تاریخ جلالی
   */
  static monthNameFromDate(jalali: string): string {
    const m = this.monthNumberFromDate(jalali);
    return persianMonths[m - 1] || '';
  }

  /**
   * شماره ماه جلالی (1 تا 12)
   */
  static monthNumberFromDate(jalali: string): number {
    const d = makeJalali(jalali);
    return Number(d.format('M'));
  }

  /**
   * سال جلالی (مثلاً 1403)
   */
  static yearFromDate(jalali: string): number {
    const d = makeJalali(jalali);
    return Number(d.format('YYYY'));
  }

  /**
   * کلید ماه برای گروه‌بندی 'YYYY/MM'
   */
  static monthKey(jalali: string): string {
    const d = makeJalali(jalali);
    return d.format('YYYY/MM');
  }

  /**
   * برچسب ماه و سال برای نمایش (مثلاً "مهر ۱۴۰۳")
   */
  static monthLabel(jalali: string): string {
    return `${this.monthNameFromDate(jalali)} ${this.yearFromDate(jalali)}`;
  }

  /**
   * کلید ماه جاری 'YYYY/MM'
   */
  static currentMonthKey(): string {
    return (dayjs as any)().calendar('jalali').format('YYYY/MM');
  }

  /**
   * اختلاف روزها بین دو تاریخ جلالی
   */
  static daysBetween(start: string, end: string): number {
    const d1 = makeJalali(start);
    const d2 = makeJalali(end);
    return d2.diff(d1, 'day');
  }

  /**
   * شماره روز امروز در ماه شمسی (1 تا 31)
   */
  static todayDay(): number {
    return Number((dayjs as any)().calendar('jalali').format('D'));
  }
}
