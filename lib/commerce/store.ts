import { randomBytes, randomUUID } from 'node:crypto';
import { db, transaction } from './database';
import type { Cart, Delivery, Line, OrderState, StockItem } from './shared';
import { itemTotals, unitPrice } from './shared';
import { oilWeights } from './oil-sizes';
import { checkoutPromotion, pricePromotion } from './promotions';

export { mockPayments } from './payment-mode';
import { mockPayments } from './payment-mode';
export { db, transaction } from './database';

type Checkout = {
  id: string; cart: string; created: number; source: 'cart' | 'buy' | 'planner'; delivery: string | null;
  lines: string | null; shipping: number | null; total: number | null; attempt: string | null;
  expires: number | null; provider: string | null; payment_url: string | null; order_id: string | null;
};
export type Order = {
  id: string; checkout_id: string; payment_id: string; state: OrderState; lines: string;
  delivery: string; shipping: number; total: number; created: number; tracking: string | null;
  refund_id: string | null;
};

export const privateId = () => randomBytes(24).toString('base64url');
export const validId = (id: string) => /^[A-Za-z0-9_-]{32}$/.test(id);
export const getCheckout = (id: string) => db().prepare('SELECT * FROM checkout WHERE id=?').get<Checkout>(id);
export const getOrder = (id: string) => db().prepare('SELECT * FROM orders WHERE id=?').get<Order>(id);
const sellableStock = `SELECT sku.* FROM sku JOIN catalogue USING(sku)
    LEFT JOIN oil_sizes ON oil_sizes.sku=sku.sku
    LEFT JOIN catalogue AS parent ON parent.sku=oil_sizes.parent_sku
    WHERE catalogue.archived=0 AND COALESCE(parent.archived,0)=0
      AND (catalogue.category <> 'oil' OR oil_sizes.grams IN (${oilWeights.join(',')}))`;

export async function getStock(sku: string) {
  const row = await db().prepare(sellableStock + ' AND sku.sku=?').get<StockItem>(sku);
  return row && { ...row };
}

export async function getStockBatch(skus: string[]) {
  if (!skus.length) return new Map<string, StockItem>();
  const placeholders = skus.map(() => '?').join(',');
  const rows = await db().prepare(sellableStock + ' AND sku.sku IN (' + placeholders + ')').all<StockItem>(...skus);
  return new Map(rows.map(row => [row.sku, row]));
}

export async function quote(cart: Cart, code?: string | null, email?: string) {
  const lines: Line[] = [];
  const stock = await getStockBatch(cart.map(item => item.sku));
  for (const item of cart) {
    const product = stock.get(item.sku);
    if (!product?.online || product.stock < item.quantity) throw new Error('Some items are unavailable in the requested quantity.');
    lines.push({ ...item, name: product.name, price: unitPrice(product, item.quantity), tax: product.tax });
  }
  const priced = await pricePromotion(lines, await shippingFee(), code, email);
  const { subtotal, tax } = itemTotals(priced.lines);
  return { ...priced, subtotal, tax, total: subtotal + priced.shipping };
}

export async function shippingFee() {
  const settings = await db().prepare('SELECT fee FROM shipping_settings WHERE id=1').get() as { fee: number } | undefined;
  const fallback = process.env.COMMERCE_SHIPPING_PAISE?.trim();
  return settings?.fee ?? (fallback ? Number(fallback) : mockPayments() ? 0 : NaN);
}

export async function createCheckout(cart: Cart, source: Checkout['source'], visit?: string) {
  await quote(cart);
  const id = privateId();
  await transaction(async () => {
    await db().prepare('INSERT INTO checkout (id, cart, created, source) VALUES (?, ?, ?, ?)').run(id, JSON.stringify(cart), Date.now(), source);
    if (visit) await db().prepare(`INSERT INTO checkout_attribution (checkout_id,visit)
      SELECT ?,? WHERE EXISTS (SELECT 1 FROM storefront_events WHERE visit=? AND kind='page_view')`).run(id, visit, visit);
  });
  return id;
}

export function reserve(checkoutId: string, delivery: Delivery, expectedTotal: number) {
  return transaction(async () => {
    const checkout = await getCheckout(checkoutId);
    if (!checkout || checkout.order_id) throw new Error('This checkout has already been completed.');
    if (checkout.attempt) return checkout;
    const code = (await checkoutPromotion(checkoutId))?.code;
    const { lines, shipping, total, offer, couponAccepted } = await quote(JSON.parse(checkout.cart), code, delivery.email);
    if (code && !couponAccepted) throw new Error('This coupon is no longer available for this order or email. Remove it to continue.');
    if (!Number.isSafeInteger(shipping) || shipping < 0 || !Number.isSafeInteger(total)) throw new Error('Shipping is being configured.');
    if (total !== expectedTotal) throw new Error('The total changed. Reload this checkout to review the updated price.');
    for (const line of lines) {
      const result = await db().prepare('UPDATE sku SET stock=stock-? WHERE sku=? AND online=1 AND stock>=?').run(line.quantity, line.sku, line.quantity);
      if (result.changes !== 1) throw new Error('Some items are unavailable in the requested quantity.');
    }
    const expires = Math.floor(Date.now() / 1000) + 3600;
    await db().prepare('UPDATE checkout SET delivery=?, lines=?, shipping=?, total=?, attempt=?, expires=? WHERE id=?')
      .run(JSON.stringify(delivery), JSON.stringify(lines), shipping, total, randomUUID(), expires, checkoutId);
    if (offer) await db().prepare(`INSERT INTO checkout_promotions (checkout_id,promotion_id,snapshot,email) VALUES (?,?,?,?)
      ON CONFLICT(checkout_id) DO UPDATE SET promotion_id=excluded.promotion_id,snapshot=excluded.snapshot,email=excluded.email`)
      .run(checkoutId, offer.id, JSON.stringify(offer), delivery.email.toLowerCase());
    return (await getCheckout(checkoutId))!;
  });
}

export async function attachPayment(attempt: string, provider: string, url: string) {
  await db().prepare('UPDATE checkout SET provider=?, payment_url=? WHERE attempt=? AND provider IS NULL').run(provider, url, attempt);
}

export async function release(checkoutId: string, attempt: string) {
  await transaction(async () => {
    const checkout = await getCheckout(checkoutId);
    if (!checkout || checkout.order_id || checkout.attempt !== attempt) return;
    for (const line of JSON.parse(checkout.lines!) as Line[]) {
      await db().prepare('UPDATE sku SET stock=stock+? WHERE sku=?').run(line.quantity, line.sku);
    }
    await db().prepare('UPDATE checkout SET attempt=NULL, expires=NULL, provider=NULL, payment_url=NULL, lines=NULL, shipping=NULL, total=NULL WHERE id=?').run(checkoutId);
    await db().prepare('UPDATE checkout_promotions SET promotion_id=NULL,snapshot=NULL,email=NULL WHERE checkout_id=?').run(checkoutId);
  });
}

export function confirmPayment(provider: string, paymentId: string, amount: number, currency: string) {
  return transaction(async () => {
    const checkout = await db().prepare('SELECT * FROM checkout WHERE provider=?').get<Checkout>(provider);
    if (!checkout) throw new Error('Payment link is not recorded yet.');
    if (amount !== checkout.total || currency !== 'INR') throw new Error('Payment amount does not match.');
    if (checkout.order_id) {
      const order = (await getOrder(checkout.order_id))!;
      if (order.payment_id !== paymentId) throw new Error('Checkout already has a different payment.');
      return order;
    }
    const id = privateId();
    await db().prepare(`INSERT INTO orders (id,checkout_id,payment_id,state,lines,delivery,shipping,total,created)
      VALUES (?,?,?,'paid',?,?,?,?,?)`).run(id, checkout.id, paymentId, checkout.lines, checkout.delivery, checkout.shipping, amount, Date.now());
    await db().prepare('UPDATE checkout SET order_id=? WHERE id=?').run(id, checkout.id);
    await queueNotification(id, 'confirmation');
    return (await getOrder(id))!;
  });
}

export async function queueNotification(id: string, kind: string) {
  await db().prepare('INSERT INTO notifications (order_id,kind) VALUES (?,?) ON CONFLICT(order_id,kind) DO NOTHING').run(id, kind);
}

export async function completeRefund(id: string, refundId: string) {
  await transaction(async () => {
    const order = await getOrder(id);
    if (order?.state !== 'refund_pending') return;
    for (const line of JSON.parse(order.lines) as Line[]) {
      await db().prepare('UPDATE sku SET stock=stock+? WHERE sku=?').run(line.quantity, line.sku);
    }
    await db().prepare("UPDATE orders SET state='refunded',refund_id=? WHERE id=?").run(refundId, id);
    await db().prepare("DELETE FROM notifications WHERE order_id=? AND kind='refill' AND sent IS NULL").run(id);
  });
}
