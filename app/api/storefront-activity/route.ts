import { z } from 'zod';
import { commerceStorageConfigured, db, transaction } from '@/lib/commerce/database';
import { cartSchema } from '@/lib/commerce/shared';
import { isAdmin } from '@/lib/commerce/admin';

const eventSchema = z.object({
  id: z.string().uuid(), visit: z.string().uuid(), cartId: z.string().uuid(),
  kind: z.enum(['page_view', 'click', 'cart_update', 'planner_result', 'withdraw']),
  path: z.string().max(180).regex(/^\/(?:[a-z0-9-]+\/?)*$/i),
  source: z.string().max(100).regex(/^[a-z0-9.-]+$/i),
  device: z.enum(['mobile', 'desktop']),
  cart: z.union([cartSchema, z.tuple([])]).optional(),
});

export async function POST(request: Request) {
  if (request.headers.get('sec-fetch-site') !== 'same-origin') return new Response(null, { status: 403 });
  if (!commerceStorageConfigured()) return new Response(null, { status: 204 });
  const body = await request.text();
  if (body.length > 12000) return new Response(null, { status: 413 });
  const parsed = eventSchema.safeParse(await Promise.resolve().then(() => JSON.parse(body)).catch(() => null));
  if (!parsed.success) return new Response(null, { status: 400 });
  const event = parsed.data;
  if (/^\/(admin|checkout|orders|account|api)(\/|$)/i.test(event.path)) return new Response(null, { status: 400 });
  if (event.kind !== 'withdraw' && await isAdmin()) return new Response(null, { status: 204 });
  const now = Date.now();
  const write = async () => {
    if (event.kind === 'withdraw') {
      await db().prepare(`DELETE FROM checkout_attribution WHERE visit=? OR visit IN
        (SELECT visit FROM storefront_events WHERE visitor=?)`).run(event.visit, event.cartId);
      await db().prepare('DELETE FROM storefront_events WHERE visit=? OR visitor=?').run(event.visit, event.cartId);
      await db().prepare('DELETE FROM cart_leads WHERE id=?').run(event.cartId);
      return;
    }
    const inserted = await db().prepare(`INSERT INTO storefront_events (id,visit,kind,path,source,device,created,visitor)
      VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING`)
      .run(event.id, event.visit, event.kind, event.path, event.source, event.device, now, event.cartId);
    if (inserted.changes && event.kind === 'cart_update' && event.cart) {
      if (event.cart.length) {
        await db().prepare(`INSERT INTO cart_leads (id,cart,updated) VALUES (?,?,?)
          ON CONFLICT(id) DO UPDATE SET cart=excluded.cart,updated=excluded.updated`)
          .run(event.cartId, JSON.stringify(event.cart), now);
      } else {
        await db().prepare('DELETE FROM cart_leads WHERE id=?').run(event.cartId);
      }
    }
  };
  if (event.kind === 'cart_update' || event.kind === 'withdraw') await transaction(write);
  else await write();
  return new Response(null, { status: 204 });
}
