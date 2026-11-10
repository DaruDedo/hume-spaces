export const periods = [
  ['1', 'Last 24 hours'], ['2', 'Last 2 days'], ['3', 'Last 3 days'],
  ['5', 'Last 5 days'], ['10', 'Last 10 days'], ['15', 'Last 15 days'],
  ['30', 'Last month'], ['all', 'All time'],
] as const;

export type PeriodPanel = 'carts' | 'checkouts' | 'orders' | 'analytics';
export const periodCookie = (panel: PeriodPanel) => 'hume_admin_period_' + panel;
export const validPeriod = (value: unknown) => periods.some(([period]) => period === value);
export const periodCutoff = (period: string, now = Date.now()) =>
  period === 'all' ? 0 : now - Number(period) * 86400000;
