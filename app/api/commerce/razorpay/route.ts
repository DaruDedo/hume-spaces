import { after } from 'next/server';
import { z } from 'zod';
import { signed } from '@/lib/commerce/payments';
import { attachPayment, confirmPayment, db, mockPayments } from '@/lib/commerce/store';
import { sendPendingNotifications } from '@/lib/commerce/notifications';

export const runtime = 'nodejs';

const eventSchema = z.object({
  payload: z.object({
    payment_link: z.object({ entity: z.object({ id: z.string(), reference_id: z.string(), short_url: z.string().url(), amount: z.number(), currency: z.literal('INR'), status: z.literal('paid') }) }),
    payment: z.object({ entity: z.object({ id: z.string(), amount: z.number(), currency: z.literal('INR'), status: z.literal('captured') }) }),
  }),
});

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || mockPayments()) return new Response(null, { status: 503 });
  const body = Buffer.from(await request.arrayBuffer());
  if (body.length > 100000 || !signed(body, request.headers.get('x-razorpay-signature') ?? '', secret)) {
    return new Response(null, { status: 401 });
  }
  try {
    const event = JSON.parse(body.toString('utf8'));
    if (event.event !== 'payment_link.paid') return new Response(null, { status: 204 });
    const { payment_link, payment } = eventSchema.parse(event).payload;
    const link = payment_link.entity;
    const expected = await db().prepare('SELECT total FROM checkout WHERE attempt=?').get<{ total: number }>(link.reference_id);
    if (!expected) return new Response(null, { status: 204 });
    if (expected.total !== link.amount || link.amount !== payment.entity.amount) return new Response(null, { status: 400 });
    await attachPayment(link.reference_id, link.id, link.short_url);
    const order = await confirmPayment(link.id, payment.entity.id, payment.entity.amount, payment.entity.currency);
    after(() => sendPendingNotifications(order.id));
    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 503 });
  }
}
