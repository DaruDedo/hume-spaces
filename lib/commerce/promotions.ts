import { db } from './database';
import { lineTotal, type Line } from './shared';

export const couponPattern = /^[A-Z0-9][A-Z0-9_-]{1,31}$/;
export type Promotion = {
  id: string; code: string | null; title: string; description: string;
  kind: 'percent' | 'fixed' | 'shipping'; value: number;
  scope: 'all' | 'equipment' | 'oil' | 'sku'; skus: string;
  minimum: number; quantity: number; cap: number;
  starts: number | null; ends: number | null; usage_limit: number; customer_limit: number;
  enabled: number; published: number; archived: number;
};
export type AppliedPromotion = Pick<Promotion, 'id' | 'title' | 'code'> & { discount: number; shippingDiscount: number };
export type CheckoutPromotion = { code: string | null; snapshot: string | null };

export const checkoutPromotion = (id: string) => db().prepare(
  'SELECT code,snapshot FROM checkout_promotions WHERE checkout_id=?',
).get<CheckoutPromotion>(id);

const active = 'archived=0 AND enabled=1 AND (starts IS NULL OR starts<=?) AND (ends IS NULL OR ends>?)';

export function promotionAmounts(rule: Promotion, eligible: Line[], shipping: number, subtotal: number) {
  const gross = eligible.reduce((sum, line) => sum + lineTotal(line), 0);
  const quantity = eligible.reduce((sum, line) => sum + line.quantity, 0);
  if (!quantity || gross < rule.minimum || quantity < rule.quantity) return null;
  if (rule.kind === 'shipping') {
    const shippingDiscount = Math.min(shipping, rule.cap || Infinity);
    return shippingDiscount > 0 ? { discount: 0, shippingDiscount } : null;
  }
  const requested = rule.kind === 'percent' ? Math.round(gross * rule.value / 10000) : rule.value;
  // Keep at least one paise payable through the existing payment flow.
  const discount = Math.min(requested, gross, rule.cap || Infinity, subtotal + (Number.isFinite(shipping) ? shipping : 0) - 1);
  return discount > 0 ? { discount, shippingDiscount: 0 } : null;
}

export async function pricePromotion(lines: Line[], shipping: number, code?: string | null, email?: string) {
  const now = Date.now();
  const candidates = await db().prepare(`SELECT * FROM promotions WHERE ${active}
    AND (code IS NULL OR code=?) ORDER BY id`).all<Promotion>(now, now, code ?? null);
  let winner: { offer: AppliedPromotion; eligible: Line[] } | undefined;
  const manual = candidates.find(rule => rule.code !== null);
  const subtotal = lines.reduce((sum, line) => sum + lineTotal(line), 0);
  const items = candidates.some(rule => rule.scope !== 'all') ? await db().prepare(
    `SELECT catalogue.sku,category,parent_sku FROM catalogue LEFT JOIN oil_sizes ON oil_sizes.sku=catalogue.sku
     WHERE catalogue.sku IN (${lines.map(() => '?').join(',')})`,
  ).all<{ sku: string; category: string; parent_sku: string | null }>(...lines.map(line => line.sku)) : [];
  const bySku = new Map(items.map(item => [item.sku, item]));
  let couponAccepted = false;
  for (const rule of candidates) {
    const skus = new Set(JSON.parse(rule.skus) as string[]);
    const eligible = lines.filter(line => {
      const item = bySku.get(line.sku);
      if (rule.scope === 'sku') return skus.has(line.sku) || Boolean(item?.parent_sku && skus.has(item.parent_sku));
      return rule.scope === 'all' || item?.category === rule.scope;
    });
    const amounts = promotionAmounts(rule, eligible, shipping, subtotal);
    if (!amounts) continue;
    if (rule.usage_limit || (email && rule.customer_limit)) {
      const usage = await db().prepare(`SELECT COUNT(*) AS total,
        COUNT(CASE WHEN email=? THEN 1 END) AS customer FROM checkout_promotions WHERE promotion_id=?`)
        .get<{ total: number; customer: number }>(email?.toLowerCase() ?? null, rule.id);
      if (rule.usage_limit && usage!.total >= rule.usage_limit || email && rule.customer_limit && usage!.customer >= rule.customer_limit) continue;
    }
    if (rule === manual) couponAccepted = true;
    const offer = { id: rule.id, code: rule.code, title: rule.title, ...amounts };
    const savings = offer.discount + offer.shippingDiscount;
    if (!winner || savings > winner.offer.discount + winner.offer.shippingDiscount ||
        (savings === winner.offer.discount + winner.offer.shippingDiscount && rule === manual)) winner = { offer, eligible };
  }
  if (!winner) return { lines, shipping, couponAccepted, offer: null };
  const { offer, eligible } = winner;
  const eligibleTotal = eligible.reduce((sum, line) => sum + lineTotal(line), 0);
  const eligibleSkus = new Set(eligible.map(line => line.sku));
  let runningGross = 0;
  let allocated = 0;
  const discounted = lines.map(line => {
    if (!offer.discount || !eligibleSkus.has(line.sku)) return line;
    runningGross += lineTotal(line);
    const target = Number(BigInt(offer.discount) * BigInt(runningGross) / BigInt(eligibleTotal));
    const discount = target - allocated;
    allocated = target;
    return { ...line, discount };
  });
  return { lines: discounted, shipping: shipping - offer.shippingDiscount, couponAccepted, offer };
}

export async function publicPromotions() {
  const now = Date.now();
  return db().prepare(`SELECT id,title,description,code,ends,kind,value,minimum,quantity,cap,scope
    FROM promotions WHERE ${active} AND published=1
    AND (usage_limit=0 OR usage_limit>(SELECT COUNT(*) FROM checkout_promotions WHERE promotion_id=promotions.id))
    ORDER BY title,id`).all<Pick<Promotion, 'id' | 'title' | 'description' | 'code' | 'ends' | 'kind' | 'value' | 'minimum' | 'quantity' | 'cap' | 'scope'>>(now, now);
}
