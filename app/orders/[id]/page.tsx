import RowSelect from '@/components/RowSelect';
import { notFound } from 'next/navigation';
import { db, getOrder, validId } from '@/lib/commerce/store';
import { itemTotals, rupees, type Delivery, type Line } from '@/lib/commerce/shared';
import { commerceEmailConfigured } from '@/lib/commerce/notifications';
import CommerceButtons from '@/components/CommerceButtons';
import CommercePrivateLink from '@/components/CommercePrivateLink';
import CompletedCart from '@/components/CompletedCart';
import { cancelRefillReminder, refillReminder } from './actions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Your order', robots: { index: false, follow: false }, referrer: 'no-referrer' as const };

const statusLabels = { paid: 'Payment confirmed', packed: 'Packed', shipped: 'Shipped', refund_pending: 'Refund pending', refunded: 'Refunded' };

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!validId(id)) notFound();
  const order = await getOrder(id);
  if (!order) notFound();
  const lines = JSON.parse(order.lines) as Line[];
  const { beforeTax, tax } = itemTotals(lines);
  const billing = (JSON.parse(order.delivery) as Delivery).gstBilling;
  const invoiceReady = billing && await db().prepare('SELECT 1 FROM order_invoices WHERE order_id=?').get(id);
  const remindersEnabled = commerceEmailConfigured()
    && ['paid', 'packed', 'shipped'].includes(order.state) && lines.some(line => line.sku.startsWith('oil-'));
  const reminder = remindersEnabled
    ? await db().prepare("SELECT due,sent FROM notifications WHERE order_id=? AND kind='refill'").get<{ due: number; sent: number | null }>(id)
    : undefined;
  return <section className="wrap commerce-page">
    <h1>{statusLabels[order.state]}</h1>
    <p>Save this private link to check your order status.</p>
    <CommercePrivateLink label="Copy order link" />
    <CompletedCart checkoutId={order.checkout_id} />
    <div className="commerce-panel">
      {lines.map(line => <div className="commerce-total" key={line.sku}><span>{line.quantity} × {line.name}</span><strong>{rupees(line.price * line.quantity)}</strong></div>)}
      <div className="commerce-total"><span>Items subtotal before GST</span><span>{rupees(beforeTax)}</span></div>
      <div className="commerce-total"><span>GST included in item prices</span><span>{rupees(tax)}</span></div>
      <div className="commerce-total"><span>Shipping</span><span>{rupees(order.shipping)}</span></div>
      <div className="commerce-total"><strong>Order total</strong><strong>{rupees(order.total)}</strong></div>
      {order.tracking && <p>Tracking reference <strong>{order.tracking}</strong></p>}
    </div>
    {billing && <div className="commerce-panel">
      <p>GST billing requested for <strong>{billing.businessName}</strong>.</p>
      {invoiceReady
        ? <a className="button outline" href={'/orders/' + id + '/invoice'}>Download GST invoice</a>
        : <p>Your GST invoice will appear here when it’s ready.</p>}
    </div>}
    <CommerceButtons items={lines.map(({ sku, quantity }) => ({ sku, quantity }))} label="Add these items again" buyNow={false} />
    {remindersEnabled && !reminder?.sent && <div className="commerce-panel">
      {reminder && <p>Your refill reminder is scheduled.</p>}
      <form action={refillReminder.bind(null, id)} className="commerce-form">
        <label>Email me a refill reminder in
          <RowSelect name="days"><option value="30">30 days</option><option value="60">60 days</option><option value="90">90 days</option></RowSelect>
        </label>
        <button className="button">{reminder ? 'Update reminder' : 'Set reminder'}</button>
      </form>
      {reminder && <form action={cancelRefillReminder.bind(null, id)}><button className="text-link dark">Cancel reminder</button></form>}
    </div>}
  </section>;
}
