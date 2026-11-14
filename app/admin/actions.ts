'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { periodCookie, validPeriod } from './periods';
import { after } from 'next/server';
import { z } from 'zod';
import { adminConfigured, adminLogin, adminLogout, isAdmin } from '@/lib/commerce/admin';
import { db, getOrder, queueNotification, transaction, validId } from '@/lib/commerce/store';
import { reconcileExpired, refund } from '@/lib/commerce/payments';
import { sendPendingNotifications } from '@/lib/commerce/notifications';
import { createOilSizes } from '@/lib/commerce/catalogue';
import { recordStaffActivity } from '@/lib/commerce/staff-activity';
import { couponPattern } from '@/lib/commerce/promotions';
import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { oilPackPrice, oilWeights } from '@/lib/commerce/oil-sizes';

async function requireAdmin() {
  if (!await isAdmin()) redirect('/admin');
}

const promotionForm = z.object({
  id: z.union([z.literal(''), z.string().uuid()]),
  code: z.string().trim().toUpperCase().refine(code => !code || couponPattern.test(code)),
  title: z.string().trim().min(2).max(80),
  description: z.string().trim().max(240),
  kind: z.enum(['percent', 'fixed', 'shipping']),
  value: z.coerce.number().min(0).max(1000000),
  scope: z.enum(['all', 'equipment', 'oil', 'sku']),
  skus: z.string().max(10000).transform(raw => [...new Set(raw.toLowerCase().split(/[\s,]+/).filter(Boolean))])
    .pipe(z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(150)).max(60)),
  minimum: z.coerce.number().min(0).max(10000000),
  quantity: z.coerce.number().int().min(0).max(4950),
  cap: z.coerce.number().min(0).max(1000000),
  starts: z.string().refine(value => !value || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) && Number.isFinite(Date.parse(value + '+05:30'))),
  ends: z.string().refine(value => !value || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) && Number.isFinite(Date.parse(value + '+05:30'))),
  usageLimit: z.coerce.number().int().min(0).max(1000000),
  customerLimit: z.coerce.number().int().min(0).max(1000000),
  enabled: z.literal('on').optional(),
  published: z.literal('on').optional(),
}).refine(rule =>
  (rule.kind === 'shipping' || Math.round(rule.value * 100) > 0) &&
  (rule.kind !== 'percent' || rule.value <= 100) &&
  (rule.scope !== 'sku' || rule.skus.length > 0) &&
  (rule.customerLimit === 0 || Boolean(rule.code)) &&
  (!rule.starts || !rule.ends || rule.starts < rule.ends),
);

export async function savePromotion(form: FormData) {
  await requireAdmin();
  const parsed = promotionForm.safeParse(Object.fromEntries(form));
  if (!parsed.success) redirect('/admin/promotions?error=promotion');
  const rule = parsed.data;
  const id = rule.id || randomUUID();
  const code = rule.code || null;
  const saved = await transaction(async () => {
    if (code && await db().prepare('SELECT id FROM promotions WHERE code=? AND id<>?').get(code, id)) return false;
    if (rule.scope === 'sku') {
      const skus = await db().prepare(`SELECT sku FROM catalogue WHERE archived=0 AND sku IN (${rule.skus.map(() => '?').join(',')})`).all(...rule.skus);
      if (skus.length !== rule.skus.length) return false;
    }
    const values = [code, rule.title, rule.description, rule.kind, rule.kind === 'shipping' ? 0 : Math.round(rule.value * 100),
      rule.scope, JSON.stringify(rule.scope === 'sku' ? rule.skus : []), Math.round(rule.minimum * 100), rule.quantity,
      Math.round(rule.cap * 100), rule.starts ? Date.parse(rule.starts + '+05:30') : null,
      rule.ends ? Date.parse(rule.ends + '+05:30') : null, rule.usageLimit, rule.customerLimit,
      Number(Boolean(rule.enabled)), Number(Boolean(rule.published))] as const;
    const result = rule.id
      ? await db().prepare(`UPDATE promotions SET code=?,title=?,description=?,kind=?,value=?,scope=?,skus=?,minimum=?,
        quantity=?,cap=?,starts=?,ends=?,usage_limit=?,customer_limit=?,enabled=?,published=? WHERE id=? AND archived=0`).run(...values, id)
      : await db().prepare(`INSERT INTO promotions (code,title,description,kind,value,scope,skus,minimum,quantity,cap,
        starts,ends,usage_limit,customer_limit,enabled,published,id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(...values, id);
    if (!result.changes) return false;
    await recordStaffActivity(rule.id ? 'Updated promotion' : 'Created promotion', id);
    return true;
  });
  if (!saved) redirect('/admin/promotions?error=promotion');
  revalidatePath('/offers');
  redirect('/admin/promotions?saved=1');
}

export async function archivePromotion(id: string) {
  await requireAdmin();
  if (!z.string().uuid().safeParse(id).success) redirect('/admin/promotions?error=promotion');
  await transaction(async () => {
    const result = await db().prepare('UPDATE promotions SET archived=1,enabled=0 WHERE id=? AND archived=0').run(id);
    if (result.changes) await recordStaffActivity('Archived promotion', id);
  });
  revalidatePath('/offers');
  redirect('/admin/promotions?saved=1');
}

export async function savePeriod(form: FormData) {
  await requireAdmin();
  const panel = form.get('panel');
  const period = form.get('period');
  if (panel !== 'carts' && panel !== 'checkouts' && panel !== 'orders' && panel !== 'analytics') return;
  if (typeof period !== 'string' || !validPeriod(period)) return;
  (await cookies()).set(periodCookie(panel), period, {
    path: '/admin', maxAge: 365 * 86400, httpOnly: true, sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });
  const params = new URLSearchParams();
  for (const key of ['q', 'status']) {
    const value = form.get(key);
    if (typeof value === 'string' && value) params.set(key, value.slice(0, 120));
  }
  redirect('/admin/' + panel + (params.size ? '?' + params : ''));
}

export async function login(form: FormData) {
  if (!adminConfigured()) redirect('/admin');
  const now = Date.now();
  const accepted = await transaction(async () => {
    const attempt = await db().prepare("SELECT count,until FROM admin_attempts WHERE key='login'").get() as { count: number; until: number } | undefined;
    if (attempt && attempt.until > now && attempt.count >= 10) return false;
    await db().prepare("INSERT INTO admin_attempts (key,count,until) VALUES ('login',?,?) ON CONFLICT(key) DO UPDATE SET count=excluded.count,until=excluded.until")
      .run(attempt && attempt.until > now ? attempt.count + 1 : 1, attempt && attempt.until > now ? attempt.until : now + 600000);
    return true;
  });
  const password = String(form.get('password') ?? '');
  if (!accepted || password.length > 256 || !await adminLogin(password)) redirect('/admin?error=login');
  await db().prepare("DELETE FROM admin_attempts WHERE key='login'").run();
  redirect('/admin');
}

export async function logout() {
  await adminLogout();
  redirect('/admin');
}

const skuForm = z.object({
  sku: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(150), name: z.string().trim().min(2).max(150),
  category: z.enum(['equipment', 'oil']),
  description: z.string().trim().min(2).max(2000),
  image: z.string().trim().regex(/^\/images\/spaces\/[a-zA-Z0-9_/.-]+\.(png|jpe?g|webp|avif)$/i).refine(path => !path.includes('..')),
  price: z.coerce.number().positive().max(1000000),
  stockChange: z.coerce.number().int().min(-1000000).max(1000000),
  tax: z.coerce.number().min(0).max(100),
  online: z.enum(['0', '1']),
  wholesaleMin: z.coerce.number().int().min(0).max(99),
  wholesalePrice: z.coerce.number().min(0).max(1000000),
}).refine(item => item.wholesaleMin === 0 || item.wholesaleMin >= 2 && item.wholesalePrice > 0 && item.wholesalePrice <= item.price);

export async function updateSku(form: FormData) {
  await requireAdmin();
  const input = skuForm.safeParse(Object.fromEntries(form));
  if (!input.success) redirect('/admin/catalogue?error=sku');
  const item = input.data;
  const updated = await transaction(async () => {
    const pack = await db().prepare('SELECT parent_sku,grams FROM oil_sizes WHERE sku=?')
      .get<{ parent_sku: string; grams: number }>(item.sku);
    const price = Math.round(item.price * 100);
    const result = await db().prepare(`UPDATE sku SET name=?,price=COALESCE(?,price),stock=stock+?,tax=?,online=?,wholesale_min=?,wholesale_price=?
      WHERE sku=? AND stock+? >= 0`).run(item.name, pack && pack.grams !== 1000 ? null : price, item.stockChange, Math.round(item.tax * 100),
      Number(item.online), item.wholesaleMin, Math.round(item.wholesalePrice * 100), item.sku, item.stockChange);
    if (result.changes !== 1) return false;
    if (pack?.grams === 1000) {
      for (const grams of oilWeights) {
        if (grams === 1000) continue;
        await db().prepare('UPDATE sku SET price=? WHERE sku=(SELECT sku FROM oil_sizes WHERE parent_sku=? AND grams=?)')
          .run(oilPackPrice(price, grams), pack.parent_sku, grams);
      }
    }
    await db().prepare('UPDATE catalogue SET description=?,image=? WHERE sku=?')
      .run(item.description, item.image, item.sku);
    await recordStaffActivity('Updated SKU', item.sku);
    return true;
  });
  redirect(updated ? '/admin/catalogue?saved=1' : '/admin/catalogue?error=sku');
}

export async function createSku(form: FormData) {
  await requireAdmin();
  const input = skuForm.safeParse(Object.fromEntries(form));
  if (!input.success || input.data.stockChange < 0) redirect('/admin/catalogue?error=sku');
  const item = input.data;
  const created = await transaction(async () => {
    const result = await db().prepare(`INSERT INTO sku (sku,name,price,stock,tax,online,wholesale_min,wholesale_price)
      VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(sku) DO NOTHING`).run(item.sku, item.name, Math.round(item.price * 100),
      item.stockChange, Math.round(item.tax * 100), item.category === 'oil' ? 0 : Number(item.online), item.wholesaleMin, Math.round(item.wholesalePrice * 100));
    if (!result.changes) return false;
    await db().prepare('INSERT INTO catalogue (sku,category,description,image) VALUES (?,?,?,?)')
      .run(item.sku, item.category, item.description, item.image);
    if (item.category === 'oil') await createOilSizes(item.sku, item.name, item.description, item.image, Math.round(item.price * 100));
    await recordStaffActivity('Created SKU', item.sku);
    return true;
  });
  redirect(created ? '/admin/catalogue?saved=1' : '/admin/catalogue?error=duplicate');
}

export async function archiveSku(form: FormData) {
  await requireAdmin();
  const sku = String(form.get('sku') ?? '');
  const archived = form.get('archived') === '1' ? 1 : 0;
  const updated = await transaction(async () => {
    const result = await db().prepare('UPDATE catalogue SET archived=? WHERE sku=?').run(archived, sku);
    if (result.changes) await recordStaffActivity(archived ? 'Archived SKU' : 'Restored SKU', sku);
    return result.changes === 1;
  });
  redirect(updated ? '/admin/catalogue?saved=1' : '/admin/catalogue?error=sku');
}

export async function updateShipping(form: FormData) {
  await requireAdmin();
  const value = String(form.get('fee') ?? '').trim();
  const message = String(form.get('message') ?? '').trim();
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(value) || !message || message.length > 180) redirect('/admin/settings?error=shipping');
  await transaction(async () => {
    await db().prepare('INSERT INTO shipping_settings (id,fee) VALUES (1,?) ON CONFLICT(id) DO UPDATE SET fee=excluded.fee')
      .run(Math.round(Number(value) * 100));
    await db().prepare("INSERT INTO store_preferences (key,value) VALUES ('delivery_message',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value")
      .run(message);
    await recordStaffActivity('Updated shipping settings', 'Shipping and delivery');
  });
  redirect('/admin/settings?saved=1');
}

export async function uploadInvoice(form: FormData) {
  await requireAdmin();
  const id = String(form.get('id') ?? '');
  const order = validId(id) && await getOrder(id);
  const file = form.get('invoice');
  if (!order || !JSON.parse(order.delivery).gstBilling || !(file instanceof File) || file.size > 750000) {
    redirect('/admin/orders?error=invoice');
  }
  const pdf = Buffer.from(await file.arrayBuffer());
  if (pdf.subarray(0, 5).toString('ascii') !== '%PDF-') redirect('/admin/orders?error=invoice');
  await transaction(async () => {
    await db().prepare('INSERT INTO order_invoices (order_id,pdf) VALUES (?,?) ON CONFLICT(order_id) DO UPDATE SET pdf=excluded.pdf')
      .run(id, pdf);
    await recordStaffActivity('Uploaded GST invoice', id);
  });
  redirect('/admin/orders?saved=1&q=' + id);
}

export async function updateOrder(form: FormData) {
  await requireAdmin();
  const id = String(form.get('id') ?? '');
  const operation = form.get('operation');
  if (!validId(id)) redirect('/admin/orders?error=order');
  const tracking = String(form.get('tracking') ?? '').trim();
  const updated = await transaction(async () => {
    if (operation === 'pack') {
      const packed = (await db().prepare("UPDATE orders SET state='packed' WHERE id=? AND state='paid'").run(id)).changes === 1;
      if (packed) await recordStaffActivity('Packed order', id);
      return packed;
    }
    if (operation === 'ship' && tracking && tracking.length <= 200) {
      const shipped = (await db().prepare("UPDATE orders SET state='shipped',tracking=? WHERE id=? AND state='packed'").run(tracking, id)).changes === 1;
      if (shipped) {
        await queueNotification(id, 'shipment');
        await recordStaffActivity('Shipped order', id);
      }
      return shipped;
    }
    if (operation === 'refund') {
      const change = await db().prepare("UPDATE orders SET state='refund_pending' WHERE id=? AND state IN ('paid','packed')").run(id);
      if (change.changes) await recordStaffActivity('Requested refund', id);
      return (await getOrder(id))?.state === 'refund_pending';
    }
    return false;
  });
  if (!updated) redirect('/admin/orders?error=order&q=' + id);
  if (operation === 'refund') {
    try { await refund(id); } catch { redirect('/admin/orders?error=refund&q=' + id); }
  }
  if (operation === 'ship') after(() => sendPendingNotifications(id));
  redirect('/admin/orders?saved=1&q=' + id);
}

export async function maintain() {
  await requireAdmin();
  try { await reconcileExpired(); } catch { redirect('/admin/activity?error=payment'); }
  after(() => sendPendingNotifications());
  redirect('/admin/activity?saved=1');
}
