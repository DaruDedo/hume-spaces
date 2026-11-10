import { db, getOrder, mockPayments, transaction } from './store';
import type { Delivery } from './shared';

export function commerceEmailConfigured() {
  return !mockPayments() && Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL && process.env.COMMERCE_PUBLIC_ORIGIN);
}

export async function sendPendingNotifications(orderId?: string) {
  if (!commerceEmailConfigured()) return;
  const origin = process.env.COMMERCE_PUBLIC_ORIGIN!;
  const rows = (orderId
    ? await db().prepare('SELECT order_id,kind FROM notifications WHERE sent IS NULL AND due<=? AND order_id=?').all(Date.now(), orderId)
    : await db().prepare('SELECT order_id,kind FROM notifications WHERE sent IS NULL AND due<=? ORDER BY due LIMIT 25').all(Date.now())) as { order_id: string; kind: string }[];
  for (const row of rows) {
    const order = (await getOrder(row.order_id))!;
    const delivery: Delivery = JSON.parse(order.delivery);
    const orderUrl = new URL('/orders/' + row.order_id, origin).href;
    const subject = row.kind === 'shipment' ? 'Your HUME Spaces order has shipped'
      : row.kind === 'refill' ? 'HUME Spaces refill reminder' : 'Your HUME Spaces order is confirmed';
    const tracking = row.kind === 'shipment' && order.tracking ? '\nTracking reference: ' + order.tracking : '';
    let failure: string;
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + process.env.RESEND_API_KEY,
          'Idempotency-Key': row.order_id + '-' + row.kind,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL,
          to: [delivery.email],
          subject,
          text: 'Hi ' + delivery.name + ',\n\n' + subject + '.' + tracking + '\n\nView your order: ' + orderUrl,
        }),
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) {
        await transaction(async () => {
          await db().prepare('UPDATE notifications SET sent=? WHERE order_id=? AND kind=?').run(Date.now(), row.order_id, row.kind);
          await db().prepare('DELETE FROM notification_failures WHERE order_id=? AND kind=?').run(row.order_id, row.kind);
        });
        continue;
      }
      failure = 'Resend returned HTTP ' + response.status;
    } catch {
      failure = 'Delivery attempt interrupted';
    }
    await db().prepare(`INSERT INTO notification_failures (order_id,kind,reason,created)
      SELECT ?,?,?,? WHERE EXISTS (SELECT 1 FROM notifications WHERE order_id=? AND kind=? AND sent IS NULL)
      ON CONFLICT(order_id,kind) DO UPDATE SET reason=excluded.reason,created=excluded.created`)
      .run(row.order_id, row.kind, failure, Date.now(), row.order_id, row.kind);
  }
}
