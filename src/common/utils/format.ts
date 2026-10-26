/**
 * Format an amount into a Persian-digit thousands-separated string with تومان suffix
 */
export function formatCurrency(amount: number | string | undefined | null): string {
  const num = typeof amount === 'string' ? Number(amount) : (amount ?? 0);
  if (Number.isNaN(num)) return '۰';
  const rounded = Math.round(num);
  const withSep = rounded.toLocaleString('en-US');
  const persian = withSep.replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d]);
  return `${persian}`;
}

/**
 * Convert any number to Persian digits
 */
export function toPersianDigits(input: string | number | undefined | null): string {
  if (input === undefined || input === null) return '';
  return input.toString().replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d]);
}

/**
 * Parse a Persian-digit number string back to a regular number
 */
export function parsePersianDigits(input: string | undefined | null): number {
  if (!input) return 0;
  const latin = input.toString().replace(/[۰-۹]/g, (d) =>
    '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString(),
  );
  const cleaned = latin.replace(/[,٬]/g, '');
  return Number(cleaned) || 0;
}
