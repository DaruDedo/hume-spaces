import Link from 'next/link';
import { db, type Order } from '@/lib/commerce/store';
import { orderStates, rupees, type Delivery } from '@/lib/commerce/shared';
import { updateOrder, uploadInvoice } from './actions';
import { date, Filters, pageNumber, Pager, ProductLines, type Query } from './views';
import { periodCutoff } from './periods';

export default async function Orders({ query, period }: { query: Query; period: string }) {
  const search = '%' + (query.q ?? '').slice(0, 120).toLowerCase() + '%';
  const status = orderStates.find(state => state === query.status) ?? '';
  const page = pageNumber(query);
  const orders = await db().prepare(`SELECT * FROM orders WHERE created>=? AND (?='' OR state=?)
    AND (LOWER(id) LIKE ? OR LOWER(delivery) LIKE ?) ORDER BY created DESC LIMIT 51 OFFSET ?`)
    .all<Order>(periodCutoff(period), status, status, search, search, (page - 1) * 50);
  const visible = orders.slice(0, 50);
  const ids = visible.map(order => order.id);
  const placeholders = ids.map(() => '?').join(',');
  const [activity, invoiceRows] = ids.length ? await Promise.all([
    db().prepare(`SELECT id,action,subject,created FROM staff_activity WHERE subject IN (${placeholders}) ORDER BY created DESC`)
      .all<{ id: string; action: string; subject: string; created: number }>(...ids),
    db().prepare(`SELECT order_id FROM order_invoices WHERE order_id IN (${placeholders})`).all<{ order_id: string }>(...ids),
  ]) : [[], []];
  const invoices = new Set(invoiceRows.map(row => row.order_id));
  return <>
    <Filters query={query} statuses={[...orderStates]} placeholder="Order ID, name or email" />
    {orders.length === 0 && <p>No orders match these filters.</p>}
    {visible.map(order => {
      const delivery: Delivery = JSON.parse(order.delivery);
      const changes = activity.filter(change => change.subject === order.id).slice(0, 15);
      return <details className="commerce-panel" key={order.id}>
        <summary>{delivery.name} · {rupees(order.total)} · {order.state.replace('_', ' ')}</summary>
        <p>{delivery.email} · {delivery.phone}</p>
        <p>{delivery.address}, {delivery.city}, {delivery.state} {delivery.pin}</p>
        <p>{date(order.created)} · {rupees(order.total)}</p><ProductLines lines={JSON.parse(order.lines)} />
        <p>Payment reference {order.payment_id}</p>
        {order.refund_id && <p>Refund reference {order.refund_id}</p>}
        {order.tracking && <p>Tracking {order.tracking}</p>}
        <Link href={'/orders/' + order.id}>Open customer order link</Link>
        <h3>Order timeline</h3>
        <ul className="admin-lines">
          {changes.map(change => <li key={change.id}><span>{change.action}</span><time>{date(change.created)}</time></li>)}
          <li><span>Order confirmed</span><time>{date(order.created)}</time></li>
        </ul>
        {delivery.gstBilling && <>
          <p><strong>GST billing requested</strong></p>
          <p>{delivery.gstBilling.businessName} · {delivery.gstBilling.gstin}</p>
          <p>{delivery.gstBilling.billingAddress}</p>
          {invoices.has(order.id) &&
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
    })}

    <Pager query={query} page={page} more={orders.length > 50} />
  </>;
}
