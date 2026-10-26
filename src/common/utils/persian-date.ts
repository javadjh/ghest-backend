import * as jalaali from 'jalaali-js';

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

export class PersianDate {
  /**
   * تبدیل تاریخ میلادی/رشته/تایم‌استمپ به رشته جلالی 'YYYY/MM/DD'
   */
  static toJalali(date: Date | string | number = new Date()): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const j = jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
    return `${j.jy}/${String(j.jm).padStart(2, '0')}/${String(j.jd).padStart(2, '0')}`;
  }

  /**
   * تبدیل رشته جلالی 'YYYY/MM/DD' به شیء Date میلادی
   */
  static toGregorian(jalaliStr: string): Date {
    const parts = jalaliStr.split(/[\/\-]/);
    if (parts.length < 3) return new Date();
    const jy = parseInt(parts[0], 10);
    const jm = parseInt(parts[1], 10);
    const jd = parseInt(parts[2], 10);
    const g = jalaali.toGregorian(jy, jm, jd);
    return new Date(g.gy, g.gm - 1, g.gd);
  }

  /**
   * فرمت تاریخ با نام ماه فارسی (مثلاً ۲۵ مهر ۱۴۰۳)
   */
  static formatJalali(date: Date | string | number): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const j = jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
    const monthName = persianMonths[j.jm - 1] || '';
    return `${j.jd} ${monthName} ${j.jy}`;
  }

  /**
   * دریافت تاریخ جلالی امروز 'YYYY/MM/DD'
   */
  static now(): string {
    return this.toJalali(new Date());
  }

  /**
   * تایم‌استمپ کامل جلالی فعلی 'YYYY/MM/DD HH:mm:ss'
   */
  static nowTimestamp(): string {
    const now = new Date();
    const datePart = this.toJalali(now);
    const timePart = [
      String(now.getHours()).padStart(2, '0'),
      String(now.getMinutes()).padStart(2, '0'),
      String(now.getSeconds()).padStart(2, '0'),
    ].join(':');
    return `${datePart} ${timePart}`;
  }

  /**
   * افزودن N ماه به یک تاریخ جلالی، بازگشت رشته جلالی
   */
  static addMonths(jalaliStr: string, months: number): string {
    const parts = jalaliStr.split(/[\/\-]/);
    if (parts.length < 3) return jalaliStr;
    let jy = parseInt(parts[0], 10);
    let jm = parseInt(parts[1], 10) + months;
    let jd = parseInt(parts[2], 10);

    while (jm > 12) {
      jm -= 12;
      jy += 1;
    }
    while (jm < 1) {
      jm += 12;
      jy -= 1;
    }

    // بررسی تعداد روزهای ماه مقصد برای جلوگیری ازOverflow (مثلا ۳۱ اسفند در سال غیرکبیسه)
    const daysInMonth = jalaali.jalaaliMonthLength(jy, jm);
    if (jd > daysInMonth) {
      jd = daysInMonth;
    }

    return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
  }

  /**
   * نام ماه فارسی (شماره ۱ تا ۱۲)
   */
  static monthName(month: number): string {
    return persianMonths[month - 1] || '';
  }

  /**
   * نام ماه فارسی از روی رشته تاریخ جلالی
   */
  static monthNameFromDate(jalaliStr: string): string {
    const m = this.monthNumberFromDate(jalaliStr);
    return persianMonths[m - 1] || '';
  }

  /**
   * شماره ماه جلالی (1 تا 12) از روی تاریخ
   */
  static monthNumberFromDate(jalaliStr: string): number {
    const parts = jalaliStr.split(/[\/\-]/);
    return parts.length >= 2 ? parseInt(parts[1], 10) : 1;
  }

  /**
   * سال جلالی از روی تاریخ
   */
  static yearFromDate(jalaliStr: string): number {
    const parts = jalaliStr.split(/[\/\-]/);
    return parts.length >= 1 ? parseInt(parts[0], 10) : 1403;
  }

  /**
   * کلید ماه برای گروه‌بندی 'YYYY/MM'
   */
  static monthKey(jalaliStr: string): string {
    const parts = jalaliStr.split(/[\/\-]/);
    if (parts.length < 2) return '';
    return `${parts[0]}/${parts[1]}`;
  }

  /**
   * برچسب ماه و سال برای نمایش (مثلاً "مهر ۱۴۰۳")
   */
  static monthLabel(jalaliStr: string): string {
    return `${this.monthNameFromDate(jalaliStr)} ${this.yearFromDate(jalaliStr)}`;
  }

  /**
   * کلید ماه جاری 'YYYY/MM'
   */
  static currentMonthKey(): string {
    return this.monthKey(this.now());
  }

  /**
   * اختلاف روزها بین دو تاریخ جلالی
   */
  static daysBetween(start: string, end: string): number {
    const d1 = this.toGregorian(start);
    const d2 = this.toGregorian(end);
    const diffTime = d2.getTime() - d1.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * شماره روز امروز در ماه شمسی (1 تا 31)
   */
  static todayDay(): number {
    const parts = this.now().split('/');
    return parts.length >= 3 ? parseInt(parts[2], 10) : 1;
  }
}
