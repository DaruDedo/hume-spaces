import AdminCatalogue from '@/components/AdminCatalogue';
import Link from 'next/link';
import { adminConfigured, isAdmin } from '@/lib/commerce/admin';
import { db, shippingFee, type Order } from '@/lib/commerce/store';
import { rupees, type Delivery } from '@/lib/commerce/shared';
import { login, logout, maintain, updateOrder, updateShipping, uploadInvoice } from './actions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Store admin', robots: { index: false, follow: false } };

const errors: Record<string, string> = {
  duplicate: 'That SKU already exists. Choose a unique SKU.',
  shipping: 'Enter a valid shipping fee in rupees.',
  invoice: 'Select a PDF under 750 KB for an order with GST billing details.',
  login: 'Sign-in failed. Check the password or wait before retrying.',
  sku: 'Check the product values and available stock.',
  order: 'This action is unavailable for the current order state. Shipping requires a tracking reference.',
  refund: 'The refund still needs verification. Use Retry refund to check again.',
  payment: 'Some payment reservations could not be checked. Try again.',
};

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string; page?: string }> }) {
  const query = await searchParams;
  if (!await isAdmin()) return <section className="wrap commerce-page">
    <h1>Store admin</h1>
    {query.error === 'login' && <p role="alert">{errors.login}</p>}
    {adminConfigured() ? <form action={login} className="commerce-form">
      <label>Staff password<input name="password" type="password" autoComplete="current-password" maxLength={256} required /></label>
      <button className="button">Sign in</button>
    </form> : <p>Staff access is being configured.</p>}
  </section>;

  const page = Math.max(1, Math.min(10000, Math.trunc(Number(query.page)) || 1));
  const orders = await db().prepare('SELECT * FROM orders ORDER BY created DESC LIMIT 51 OFFSET ?').all((page - 1) * 50) as Order[];
  const fee = await shippingFee();
  const propertyRequests = await db().prepare(
    'SELECT term, requests FROM property_type_requests ORDER BY requests DESC, term LIMIT 50'
  ).all<{ term: string; requests: number }>();
  return <section className="wrap commerce-page">
    <h1>Store admin</h1>
    <div className="commerce-actions">
      <form action={logout}><button className="button">Sign out</button></form>
      <form action={maintain}><button className="button">Check expired payments and retry emails</button></form>
    </div>
    {query.error && <p role="alert">{errors[query.error] ?? 'Unable to save the change.'}</p>}
    {query.saved && <p role="status">Update saved.</p>}
    <section id="shipping-settings">
      <h2>Shipping settings</h2>
      <form action={updateShipping} className="commerce-form">
        <label>Flat shipping fee per order (₹)
          <input name="fee" type="number" min="0" max="9999999.99" step="0.01" defaultValue={Number.isFinite(fee) ? fee / 100 : undefined} required />
        </label>
        <p>Enter 0 for free shipping. Changes apply to new payment attempts.</p>
        <button className="button">Save shipping settings</button>
      </form>
    </section>
    <details className="simple-disclosure">
      <summary>Requested property types</summary>
      {propertyRequests.length ? <ul>
        {propertyRequests.map(({ term, requests }) => <li key={term}>{term} · {requests} {requests === 1 ? 'request' : 'requests'}</li>)}
      </ul> : <p>No new property types have been requested.</p>}
    </details>
    <h2>Orders</h2>
    {orders.length === 0 && <p>No orders on this page.</p>}
    {await Promise.all(orders.slice(0, 50).map(async order => {
      const delivery: Delivery = JSON.parse(order.delivery);
      return <details className="commerce-panel" key={order.id}>
        <summary>{delivery.name} · {rupees(order.total)} · {order.state.replace('_', ' ')}</summary>
        <p>{delivery.email} · {delivery.phone}</p>
        <p>{delivery.address}, {delivery.city}, {delivery.state} {delivery.pin}</p>
        <p>Payment reference {order.payment_id}</p>
        {order.refund_id && <p>Refund reference {order.refund_id}</p>}
        {order.tracking && <p>Tracking {order.tracking}</p>}
        <Link href={'/orders/' + order.id}>Open customer order link</Link>
        {delivery.gstBilling && <>
          <p><strong>GST billing requested</strong></p>
          <p>{delivery.gstBilling.businessName} · {delivery.gstBilling.gstin}</p>
          <p>{delivery.gstBilling.billingAddress}</p>
          {Boolean(await db().prepare('SELECT 1 FROM order_invoices WHERE order_id=?').get(order.id)) &&
            <a href={'/orders/' + order.id + '/invoice'}>Download current GST invoice</a>}
          <form action={uploadInvoice} className="commerce-form">
            <input type="hidden" name="id" value={order.id} />
            <label>GST invoice PDF (up to 750 KB)<input type="file" name="invoice" accept="application/pdf,.pdf" required /></label>
            <button className="button">Save invoice for customer</button>
          </form>
        </>}
        <form action={updateOrder} className="commerce-form">
          <input type="hidden" name="id" value={order.id} />
          {order.state === 'paid' && <button className="button" name="operation" value="pack">Mark packed</button>}
          {order.state === 'packed' && <>
            <label>Tracking reference<input name="tracking" maxLength={200} /></label>
            <button className="button" name="operation" value="ship">Mark shipped</button>
          </>}
          {['paid', 'packed', 'refund_pending'].includes(order.state) &&
            <button className="button outline" name="operation" value="refund">{order.state === 'refund_pending' ? 'Retry refund' : 'Cancel and refund in full'}</button>}
        </form>
      </details>;
    }))}
    <div className="commerce-actions">
      {page > 1 && <Link href={'/admin?page=' + (page - 1)}>Newer orders</Link>}
      {orders.length > 50 && <Link href={'/admin?page=' + (page + 1)}>Older orders</Link>}
    </div>
    <AdminCatalogue />
  </section>;
}
