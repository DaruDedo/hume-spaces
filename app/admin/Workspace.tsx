import Link from 'next/link';
import { cookies } from 'next/headers';
import AdminCatalogue from '@/components/AdminCatalogue';
import { adminConfigured, isAdmin } from '@/lib/commerce/admin';
import { login, logout } from './actions';
import Orders from './Orders';
import { Dashboard, Queue, Customers, Settings, Activity } from './Panels';
import type { Query } from './views';
import PeriodPicker from './PeriodPicker';
import { periodCookie, validPeriod } from './periods';

export type { Query } from './views';
export const panels = {
  home: 'Overview',
  carts: 'Cart leads',
  checkouts: 'Checkouts',
  orders: 'Orders',
  catalogue: 'Catalogue & inventory',
  customers: 'Customers',
  analytics: 'Analytics',
  settings: 'Settings',
  activity: 'Activity',
} as const;
export type Panel = keyof typeof panels;

const errors: Record<string, string> = {
  duplicate: 'That SKU already exists. Choose a unique SKU.',
  shipping: 'Enter a valid shipping fee in rupees and a delivery message.',
  invoice: 'Select a PDF under 750 KB for an order with GST billing details.',
  login: 'Sign-in failed. Check the password or wait before retrying.',
  sku: 'Check the product values and available stock.',
  order: 'This action is unavailable for the current order state. Shipping requires a tracking reference.',
  refund: 'The refund still needs verification. Use Retry refund to check again.',
  payment: 'Some payment reservations could not be checked. Try again.',
};

function Nav({ panel }: { panel: Panel }) {
  return <nav aria-label="Admin navigation">{Object.entries(panels).map(([key, title]) =>
    <Link key={key} href={key === 'home' ? '/admin' : '/admin/' + key}
      aria-current={panel === key ? 'page' : undefined}>{title}</Link>
  )}</nav>;
}

export default async function Workspace({ panel, query }: { panel: Panel; query: Query }) {
  if (!await isAdmin()) return <div className="admin-login">
    <section className="admin-card">
      <p className="admin-brand">HUME <span>SPACES</span></p>
      <h1>Store admin</h1>

      {query.error === 'login' && <p role="alert">{errors.login}</p>}
      {adminConfigured() ? <form action={login} className="commerce-form">
        <label>Staff password<input name="password" type="password" autoComplete="current-password" maxLength={256} required /></label>
        <button className="button">Sign in</button>
      </form> : <p>Staff access is being configured.</p>}
      <Link href="/">Back to store</Link>
    </section>
  </div>;

  const title = panels[panel];
  const periodPanel = panel === 'carts' || panel === 'checkouts' || panel === 'orders' || panel === 'analytics' ? panel : null;
  const storedPeriod = periodPanel && (await cookies()).get(periodCookie(periodPanel))?.value;
  const period = storedPeriod && validPeriod(storedPeriod) ? storedPeriod : panel === 'analytics' ? '30' : 'all';
  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <Link className="admin-brand" href="/admin">HUME <span>STORE ADMIN</span></Link>
      <Nav panel={panel} />
    </aside>
    <div className="admin-body">
      <header className="admin-top">
        <details className="admin-mobile-nav" key={panel}><summary>Menu</summary><Nav panel={panel} /></details>
        <span>Staff workspace</span>
        <Link href="/">View store</Link>
        <form action={logout}><button>Sign out</button></form>
      </header>
      <div className="admin-content" key={panel}>
        <h1>{title}</h1>

        {query.error && <p className="admin-notice" role="alert">{errors[query.error] ?? 'Unable to save the change.'}</p>}
        {query.saved && <p className="admin-notice" role="status">Update saved.</p>}
        {periodPanel && <PeriodPicker panel={periodPanel} period={period} search={query.q} status={query.status} />}
        {(panel === 'home' || panel === 'analytics') && <Dashboard query={query} analyticsPeriod={panel === 'analytics' ? period : undefined} />}
        {(panel === 'carts' || panel === 'checkouts') && <Queue query={query} carts={panel === 'carts'} period={period} />}
        {panel === 'orders' && <Orders query={query} period={period} />}
        {panel === 'catalogue' && <AdminCatalogue query={query} />}
        {panel === 'customers' && <Customers query={query} />}
        {panel === 'settings' && <Settings />}
        {panel === 'activity' && <Activity />}
      </div>
    </div>
  </div>;
}
