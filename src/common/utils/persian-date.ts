import dayjs from 'dayjs';
// @ts-ignore
import jalaliday from 'jalaliday';
import 'dayjs/locale/fa';

// Extend dayjs with jalali calendar plugin
dayjs.extend(jalaliday as any);
dayjs.calendar('jalali');
dayjs.locale('fa');

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

function makeJalali(jalali: string) {
  const d = dayjs(jalali, { jalali: true }).calendar('jalali');
  return d;
}

export class PersianDate {
  /**
   * Convert Gregorian Date to Persian (Jalali) string 'YYYY/MM/DD'
   */
  static toJalali(date: Date | string | number): string {
    const d = dayjs(date).calendar('jalali');
    return d.format('YYYY/MM/DD');
  }

  /**
   * Convert Jalali string 'YYYY/MM/DD' to Gregorian Date
   */
  static toGregorian(jalali: string): Date {
    const d = dayjs(jalali, { jalali: true }).calendar('jalali');
    return d.toDate();
  }

  /**
   * Format date with Persian month name
   */
  static formatJalali(date: Date | string | number): string {
    const d = dayjs(date).calendar('jalali');
    return d.format('D MMMM YYYY');
  }

  /**
   * Get current Persian date string YYYY/MM/DD
   */
  static now(): string {
    return dayjs().calendar('jalali').format('YYYY/MM/DD');
  }

  /**
   * Get current full timestamp
   */
  static nowTimestamp(): string {
    return dayjs().calendar('jalali').format('YYYY/MM/DD HH:mm:ss');
  }

  /**
   * Add N months to a Jalali date, returns Jalali string
   */
  static addMonths(jalali: string, months: number): string {
    const d = dayjs(jalali, { jalali: true })
      .calendar('jalali')
      .add(months, 'month');
    return d.format('YYYY/MM/DD');
  }

  /**
   * Returns the Persian month name (1-based index)
   */
  static monthName(month: number): string {
    return persianMonths[month - 1] || '';
  }

  /**
   * Returns the Persian month name from a Jalali date string
   */
  static monthNameFromDate(jalali: string): string {
    const m = this.monthNumberFromDate(jalali);
    return persianMonths[m - 1];
  }

  /**
   * Returns the Persian month index (1-12) from a Jalali date
   */
  static monthNumberFromDate(jalali: string): number {
    const d = makeJalali(jalali);
    return Number(d.format('M'));
  }

  /**
   * Returns the Persian year from a Jalali date
   */
  static yearFromDate(jalali: string): number {
    const d = makeJalali(jalali);
    return Number(d.format('YYYY'));
  }

  /**
   * Returns "YYYY-MM" key for monthly aggregation
   */
  static monthKey(jalali: string): string {
    const d = makeJalali(jalali);
    return d.format('YYYY/MM');
  }

  /**
   * Returns the Persian month name + year for display ("مهر ۱۴۰۴")
   */
  static monthLabel(jalali: string): string {
    return `${this.monthNameFromDate(jalali)} ${this.yearFromDate(jalali)}`;
  }

  /**
   * Returns the current Persian month key (YYYY/MM)
   */
  static currentMonthKey(): string {
    return dayjs().calendar('jalali').format('YYYY/MM');
  }

  /**
   * Days difference between two Jalali dates
   */
  static daysBetween(start: string, end: string): number {
    const d1 = dayjs(start, { jalali: true }).calendar('jalali');
    const d2 = dayjs(end, { jalali: true }).calendar('jalali');
    return d2.diff(d1, 'day');
  }

  /**
   * Returns today's Jalali day number (1-31)
   */
  static todayDay(): number {
    return Number(dayjs().calendar('jalali').format('D'));
  }
}
