'use server';

import { redirect } from 'next/navigation';
import { db, getOrder, validId } from '@/lib/commerce/store';
import type { Line } from '@/lib/commerce/shared';
import { commerceEmailConfigured } from '@/lib/commerce/notifications';

export async function refillReminder(id: string, form: FormData) {
  if (!validId(id)) return;
  const order = await getOrder(id);
  if (!order || !['paid', 'packed', 'shipped'].includes(order.state)) return;
  if (!(JSON.parse(order.lines) as Line[]).some(line => line.sku.startsWith('oil-'))) return;
  if (!commerceEmailConfigured()) return;
  const days = Number(form.get('days'));
  if (![30, 60, 90].includes(days)) return;
  await db().prepare(`INSERT INTO notifications (order_id,kind,due) VALUES (?,'refill',?)
    ON CONFLICT(order_id,kind) DO UPDATE SET due=excluded.due WHERE sent IS NULL`).run(id, Date.now() + days * 86400000);
  redirect('/orders/' + id);
}

export async function cancelRefillReminder(id: string) {
  if (!validId(id)) return;
  await db().prepare("DELETE FROM notifications WHERE order_id=? AND kind='refill' AND sent IS NULL").run(id);
  redirect('/orders/' + id);
}
