'use server';
import { commerceStorageConfigured } from '@/lib/commerce/database';

import { after } from 'next/server';
import { catalogueHref, catalogueItem } from '@/lib/commerce/catalogue';
import { cartSchema, deliverySchema } from '@/lib/commerce/shared';
import { createCheckout, db, getCheckout, getStock, reserve, validId } from '@/lib/commerce/store';
import { openPayment, paymentReady, reconcile, reconcileExpired } from '@/lib/commerce/payments';
import { sendPendingNotifications } from '@/lib/commerce/notifications';
import { propertySearchTerm } from '@/lib/property-search-term';

export async function recordPropertyType(input: unknown) {
  const term = propertySearchTerm(input);
  if (!term || !commerceStorageConfigured()) return;
  await db().prepare(`INSERT INTO property_type_requests (term) VALUES (?)
    ON CONFLICT(term) DO UPDATE SET requests=property_type_requests.requests+1`).run(term.toLowerCase());
}

export async function cardAvailability() {
  if (!commerceStorageConfigured()) return {};
  const rows = await db().prepare('SELECT sku.sku, online, stock, archived FROM sku JOIN catalogue USING(sku)')
    .all<{ sku: string; online: number; stock: number; archived: number }>();
  return Object.fromEntries(rows.map(row => [row.sku, { online: row.online === 1 && !row.archived, available: row.stock > 0, archived: row.archived === 1 }]));
}

export async function cartDetails(input: unknown) {
  const parsed = cartSchema.safeParse(input);
  if (!parsed.success) return [];
  return Promise.all(parsed.data.map(async line => {
    const entry = await catalogueItem(line.sku);
    const product = entry ? await getStock(line.sku) : undefined;
    return { ...line, product, href: product ? catalogueHref(entry?.parent_sku ?? line.sku) : '/shop', image: product ? entry?.image : undefined };
  }));
}

export async function startCheckout(input: unknown, source: 'cart' | 'buy') {
  const parsed = cartSchema.safeParse(input);
  if (!parsed.success || !['cart', 'buy'].includes(source)) return { error: 'Check the items and quantities in your cart.' };
  try {
    await reconcileExpired();
    return { url: '/checkout/' + await createCheckout(parsed.data, source) };
  } catch {
    return { error: 'Some items are unavailable in the requested quantity. Review your cart and try again.' };
  }
}

export async function savedCheckoutSummaries(input: unknown) {
  if (!Array.isArray(input) || input.length > 20 || !commerceStorageConfigured()) return [];
  const ids = [...new Set(input.filter((id): id is string => typeof id === 'string' && validId(id)))];
  const summaries = await Promise.all(ids.map(async id => {
    const checkout = await getCheckout(id);
    if (!checkout) return null;
    const cart = cartSchema.parse(JSON.parse(checkout.cart));
    const first = await catalogueItem(cart[0].sku);
    return {
      id,
      created: checkout.created,
      title: first?.name ?? 'Scenting products',
      additionalProducts: cart.length - 1,
      quantity: cart.reduce((sum, item) => sum + item.quantity, 0),
      paymentStarted: Boolean(checkout.attempt),
      orderId: checkout.order_id,
    };
  }));
  return summaries.filter(summary => summary !== null);
}

export async function startPayment(id: string, form: FormData) {
  if (!validId(id)) return { error: 'Checkout not found.' };
  if (!paymentReady()) return { error: 'Online payment is being configured.' };
  try {
    let checkout = await getCheckout(id);
    if (!checkout) return { error: 'Checkout not found.' };
    if (checkout.attempt) {
      await reconcile(checkout);
      checkout = (await getCheckout(id))!;
    }
    if (checkout.order_id) return { url: '/orders/' + checkout.order_id };
    if (checkout.attempt) return { url: await openPayment(checkout) };
    const delivery = deliverySchema.safeParse({
      ...Object.fromEntries(form),
      gstBilling: form.get('gstBillingRequested') === 'yes' ? {
        gstin: form.get('gstin'),
        businessName: form.get('businessName'),
        billingAddress: form.get('billingAddress'),
      } : undefined,
    });
    if (!delivery.success) {
      return { error: delivery.error.issues.some(issue => issue.path[0] === 'gstBilling')
        ? 'Check the GSTIN, registered business name and billing address.'
        : 'Check your delivery details, including the email, phone and PIN code.' };
    }
    const expected = Number(form.get('total'));
    try {
      checkout = await reserve(id, delivery.data, expected);
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unable to reserve these items.' };
    }
    return { url: await openPayment(checkout) };
  } catch {
    return { error: 'Payment is temporarily unavailable. You can retry using this checkout link.' };
  }
}

export async function checkPayment(id: string) {
  if (!validId(id)) return { error: 'Checkout not found.' };
  try {
    const checkout = await getCheckout(id);
    if (!checkout) return { error: 'Checkout not found.' };
    if (checkout.order_id) return { url: '/orders/' + checkout.order_id };
    const order = await reconcile(checkout);
    if (!order) return { error: 'Payment has not been confirmed yet. If you already paid, check again shortly.' };
    after(() => sendPendingNotifications(order.id));
    return { url: '/orders/' + order.id };
  } catch {
    return { error: 'Payment status is temporarily unavailable. Please check again.' };
  }
}
