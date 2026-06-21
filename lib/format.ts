export function formatCurrency(amount: number): string {
  return `৳${amount.toLocaleString()}`;
}

export type DateFormatPreset = 'short' | 'medium' | 'long';

const DATE_OPTIONS: Record<DateFormatPreset, Intl.DateTimeFormatOptions> = {
  short: { day: 'numeric', month: 'short' },
  medium: { day: 'numeric', month: 'short', year: 'numeric' },
  long: { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' },
};

export function formatDate(date: Date | string, preset: DateFormatPreset = 'medium'): string {
  return new Date(date).toLocaleDateString('en-BD', DATE_OPTIONS[preset]);
}
