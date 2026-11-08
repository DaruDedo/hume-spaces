'use server';

import { redirect } from 'next/navigation';
import { after } from 'next/server';
import { z } from 'zod';
import { adminConfigured, adminLogin, adminLogout, isAdmin } from '@/lib/commerce/admin';
import { db, getOrder, queueNotification, transaction, validId } from '@/lib/commerce/store';
import { reconcileExpired, refund } from '@/lib/commerce/payments';
import { sendPendingNotifications } from '@/lib/commerce/notifications';
import { createOilSizes } from '@/lib/commerce/catalogue';

async function requireAdmin() {
  if (!await isAdmin()) redirect('/admin');
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
  if (!input.success) redirect('/admin?error=sku');
  const item = input.data;
  const updated = await transaction(async () => {
    const result = await db().prepare(`UPDATE sku SET name=?,price=?,stock=stock+?,tax=?,online=?,wholesale_min=?,wholesale_price=?
      WHERE sku=? AND stock+? >= 0`).run(item.name, Math.round(item.price * 100), item.stockChange, Math.round(item.tax * 100),
      Number(item.online), item.wholesaleMin, Math.round(item.wholesalePrice * 100), item.sku, item.stockChange);
    if (result.changes !== 1) return false;
    await db().prepare('UPDATE catalogue SET description=?,image=? WHERE sku=?')
      .run(item.description, item.image, item.sku);
    return true;
  });
  redirect(updated ? '/admin?saved=1#catalogue' : '/admin?error=sku#catalogue');
}

export async function createSku(form: FormData) {
  await requireAdmin();
  const input = skuForm.safeParse(Object.fromEntries(form));
  if (!input.success || input.data.stockChange < 0) redirect('/admin?error=sku#catalogue');
  const item = input.data;
  const created = await transaction(async () => {
    const result = await db().prepare(`INSERT INTO sku (sku,name,price,stock,tax,online,wholesale_min,wholesale_price)
      VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(sku) DO NOTHING`).run(item.sku, item.name, Math.round(item.price * 100),
      item.stockChange, Math.round(item.tax * 100), item.category === 'oil' ? 0 : Number(item.online), item.wholesaleMin, Math.round(item.wholesalePrice * 100));
    if (!result.changes) return false;
    await db().prepare('INSERT INTO catalogue (sku,category,description,image) VALUES (?,?,?,?)')
      .run(item.sku, item.category, item.description, item.image);
    if (item.category === 'oil') await createOilSizes(item.sku, item.name, item.description, item.image);
    return true;
  });
  redirect(created ? '/admin?saved=1#catalogue' : '/admin?error=duplicate#catalogue');
}

export async function archiveSku(form: FormData) {
  await requireAdmin();
  const sku = String(form.get('sku') ?? '');
  const archived = form.get('archived') === '1' ? 1 : 0;
  await transaction(() => db().prepare('UPDATE catalogue SET archived=? WHERE sku=?').run(archived, sku));
  redirect('/admin?saved=1#catalogue');
}

export async function updateShipping(form: FormData) {
  await requireAdmin();
  const value = String(form.get('fee') ?? '').trim();
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(value)) redirect('/admin?error=shipping#shipping-settings');
  await transaction(() => db().prepare('INSERT INTO shipping_settings (id,fee) VALUES (1,?) ON CONFLICT(id) DO UPDATE SET fee=excluded.fee')
    .run(Math.round(Number(value) * 100)));
  redirect('/admin?saved=1#shipping-settings');
}

export async function uploadInvoice(form: FormData) {
  await requireAdmin();
  const id = String(form.get('id') ?? '');
  const order = validId(id) && await getOrder(id);
  const file = form.get('invoice');
  if (!order || !JSON.parse(order.delivery).gstBilling || !(file instanceof File) || file.size > 750000) {
    redirect('/admin?error=invoice');
  }
  const pdf = Buffer.from(await file.arrayBuffer());
  if (pdf.subarray(0, 5).toString('ascii') !== '%PDF-') redirect('/admin?error=invoice');
  await db().prepare('INSERT INTO order_invoices (order_id,pdf) VALUES (?,?) ON CONFLICT(order_id) DO UPDATE SET pdf=excluded.pdf')
    .run(id, pdf);
  redirect('/admin?saved=1');
}

export async function updateOrder(form: FormData) {
  await requireAdmin();
  const id = String(form.get('id') ?? '');
  const operation = form.get('operation');
  if (!validId(id)) redirect('/admin?error=order');
  const tracking = String(form.get('tracking') ?? '').trim();
  const updated = await transaction(async () => {
    if (operation === 'pack') return (await db().prepare("UPDATE orders SET state='packed' WHERE id=? AND state='paid'").run(id)).changes === 1;
    if (operation === 'ship' && tracking && tracking.length <= 200) {
      const shipped = (await db().prepare("UPDATE orders SET state='shipped',tracking=? WHERE id=? AND state='packed'").run(tracking, id)).changes === 1;
      if (shipped) await queueNotification(id, 'shipment');
      return shipped;
    }
    if (operation === 'refund') {
      await db().prepare("UPDATE orders SET state='refund_pending' WHERE id=? AND state IN ('paid','packed')").run(id);
      return (await getOrder(id))?.state === 'refund_pending';
    }
    return false;
  });
  if (!updated) redirect('/admin?error=order');
  if (operation === 'refund') {
    try { await refund(id); } catch { redirect('/admin?error=refund'); }
  }
  if (operation === 'ship') after(() => sendPendingNotifications(id));
  redirect('/admin?saved=1');
}

export async function maintain() {
  await requireAdmin();
  try { await reconcileExpired(); } catch { redirect('/admin?error=payment'); }
  after(() => sendPendingNotifications());
  redirect('/admin?saved=1');
}
