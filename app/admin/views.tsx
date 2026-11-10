import Link from 'next/link';
import RowSelect from '@/components/RowSelect';
import { rupees } from '@/lib/commerce/shared';

export type Query = { q?: string; status?: string; page?: string; days?: string; error?: string; saved?: string };
export function adminQuery(input: Record<string, string | string[] | undefined>): Query {
  const keys = ['q', 'status', 'page', 'days', 'error', 'saved'] as const;
  return Object.fromEntries(keys.map(key => [key, typeof input[key] === 'string' ? input[key].slice(0, 120) : undefined]));
}
export const day = 86400000;
export const pageNumber = (query: Query) => Math.max(1, Math.min(10000, Math.trunc(Number(query.page)) || 1));
export const date = (time: number) => new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata',
}).format(time);
export const label = (status: string) => status.replaceAll('_', ' ');

export function Filters({ query, statuses, placeholder }: { query: Query; statuses?: string[]; placeholder: string }) {
  return <form className="admin-filters">
    <label>Search<input type="search" name="q" defaultValue={query.q} placeholder={placeholder} maxLength={120} /></label>
    {statuses && <label>Status<RowSelect name="status" defaultValue={query.status ?? ''}>
      <option value="">All statuses</option>
      {statuses.map(status => <option key={status} value={status}>{label(status)}</option>)}
    </RowSelect></label>}
    <button className="button">Apply filters</button>
  </form>;
}

export function Pager({ query, page, more }: { query: Query; page: number; more: boolean }) {
  const href = (next: number) => '?' + new URLSearchParams({ q: query.q ?? '', status: query.status ?? '', page: String(next) });
  return <nav className="admin-pages" aria-label="Results pages">
    {page > 1 && <Link href={href(page - 1)}>Previous</Link>}
    <span>Page {page}</span>
    {more && <Link href={href(page + 1)}>Next</Link>}
  </nav>;
}

export function ProductLines({ lines }: { lines: { sku: string; name?: string; quantity: number; price?: number }[] }) {
  return <ul className="admin-lines">{lines.map(line => <li key={line.sku}>
    <span>{line.quantity} × {line.name ?? line.sku}</span>
    {line.price !== undefined && <strong>{rupees(line.price * line.quantity)}</strong>}
  </li>)}</ul>;
}
