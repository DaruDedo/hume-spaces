import { createHmac, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { attachPayment, confirmPayment, db, getCheckout, getOrder, mockPayments, release, completeRefund } from './store';

export function matchesSecret(actual: string, expected: string) {
  const a = Buffer.from(actual);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function signed(body: string | Buffer, signature: string, secret: string) {
  return matchesSecret(signature, createHmac('sha256', secret).update(body).digest('hex'));
}

export const paymentReady = () => mockPayments() || Boolean(
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_WEBHOOK_SECRET
);

async function razorpay(path: string, options?: { body: object; idempotency?: string }) {
  const authorization = Buffer.from(process.env.RAZORPAY_KEY_ID + ':' + process.env.RAZORPAY_KEY_SECRET).toString('base64');
  const response = await fetch('https://api.razorpay.com/v1' + path, {
    method: options ? 'POST' : 'GET',
    headers: {
      Authorization: 'Basic ' + authorization,
      ...(options && { 'Content-Type': 'application/json' }),
      ...(options?.idempotency && { 'X-Refund-Idempotency': options.idempotency }),
    },
    body: options && JSON.stringify(options.body),
    cache: 'no-store',
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error('Payment service could not complete the request. Please retry.');
  return response.json() as Promise<unknown>;
}

const paymentLink = z.object({
  id: z.string().regex(/^plink_[a-zA-Z0-9]+$/),
  short_url: z.string().url().refine(url => new URL(url).protocol === 'https:'),
  status: z.string(),
  amount: z.number().int(),
  currency: z.string(),
  reference_id: z.string(),
  payments: z.array(z.object({ payment_id: z.string().regex(/^pay_[a-zA-Z0-9]+$/) })).nullish(),
});

type Checkout = NonNullable<Awaited<ReturnType<typeof getCheckout>>>;

async function findPaymentLink(attempt: string) {
  const result = z.object({ payment_links: z.array(paymentLink).nullish() })
    .parse(await razorpay('/payment_links?reference_id=' + encodeURIComponent(attempt)));
  return result.payment_links?.find(link => link.reference_id === attempt);
}

export async function openPayment(checkout: Checkout) {
  if (!checkout.attempt || !checkout.expires || checkout.total === null) throw new Error('Checkout is not ready.');
  if (checkout.payment_url) return checkout.payment_url;
  if (checkout.expires <= Date.now() / 1000 + 60) throw new Error('This payment window has ended. Reload to try again.');
  if (mockPayments()) {
    await attachPayment(checkout.attempt, 'mock_' + checkout.attempt, '/checkout/' + checkout.id + '/test');
    return '/checkout/' + checkout.id + '/test';
  }

  const attempt = checkout.attempt;
  let link = await findPaymentLink(attempt);
  if (!link) {
    try {
      link = paymentLink.parse(await razorpay('/payment_links', { body: {
        amount: checkout.total,
        currency: 'INR',
        reference_id: attempt,
        accept_partial: false,
        expire_by: checkout.expires,
        description: 'HUME Spaces order',
        notify: { sms: false, email: false },
        reminder_enable: false,
        ...(process.env.COMMERCE_PUBLIC_ORIGIN && {
          callback_url: new URL('/checkout/' + checkout.id, process.env.COMMERCE_PUBLIC_ORIGIN).href,
          callback_method: 'get',
        }),
      } }));
    } catch (error) {
      link = await findPaymentLink(attempt);
      if (!link) throw error;
    }
  }
  if (link.amount !== checkout.total || link.currency !== 'INR' || link.reference_id !== attempt) {
    throw new Error('Payment link does not match this checkout.');
  }
  await attachPayment(attempt, link.id, link.short_url);
  return link.short_url;
}

export async function reconcile(checkout: Checkout) {
  if (!checkout.attempt || checkout.order_id) return;
  if (mockPayments()) {
    if (checkout.expires! <= Date.now() / 1000) await release(checkout.id, checkout.attempt);
    return;
  }
  if (!paymentReady()) return;
  const link = checkout.provider
    ? paymentLink.parse(await razorpay('/payment_links/' + checkout.provider))
    : await findPaymentLink(checkout.attempt);
  if (!link) {
    if (checkout.expires! <= Date.now() / 1000) await release(checkout.id, checkout.attempt);
    return;
  }
  if (link.reference_id !== checkout.attempt || link.amount !== checkout.total || link.currency !== 'INR') {
    throw new Error('Payment link does not match this checkout.');
  }
  await attachPayment(checkout.attempt, link.id, link.short_url);
  if (link.status === 'expired' || link.status === 'cancelled') await release(checkout.id, checkout.attempt);
  if (link.status !== 'paid') return;
  for (const entry of link.payments ?? []) {
    const payment = z.object({ id: z.string(), status: z.string(), amount: z.number(), currency: z.string() })
      .parse(await razorpay('/payments/' + entry.payment_id));
    if (payment.status === 'captured') return await confirmPayment(link.id, payment.id, payment.amount, payment.currency);
  }
}

export async function refund(id: string) {
  const order = await getOrder(id);
  if (!order || order.state !== 'refund_pending') return;
  if (mockPayments()) {
    await completeRefund(id, 'mock_refund_' + id);
    return;
  }
  if (!paymentReady()) throw new Error('Payment service is not configured.');
  const result = order.refund_id
    ? await razorpay('/payments/' + order.payment_id + '/refunds/' + order.refund_id)
    : await razorpay('/payments/' + order.payment_id + '/refund', {
      body: { amount: order.total }, idempotency: 'hume-' + id,
    });
  const refundData = z.object({ id: z.string(), status: z.string() }).parse(result);
  await db().prepare("UPDATE orders SET refund_id=? WHERE id=? AND state='refund_pending'").run(refundData.id, id);
  if (refundData.status === 'processed') await completeRefund(id, refundData.id);
}

export async function reconcileExpired() {
  const expired = await db().prepare('SELECT * FROM checkout WHERE order_id IS NULL AND expires<=? ORDER BY expires LIMIT 25')
    .all(Math.floor(Date.now() / 1000)) as Checkout[];
  for (const checkout of expired) await reconcile(checkout);
}
