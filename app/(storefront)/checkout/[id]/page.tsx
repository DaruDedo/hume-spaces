import Image from 'next/image';
import Link from '@/components/PageProgress';
import { catalogueItem } from '@/lib/commerce/catalogue';
import { deliveryMessage } from '@/lib/commerce/preferences';
import { notFound, redirect } from 'next/navigation';
import CheckoutForm from '@/components/CheckoutForm';
import CheckoutCoupon from '@/components/CheckoutCoupon';
import { RememberCheckout } from '@/components/CheckoutHistory';
import { getCheckout, quote, validId } from '@/lib/commerce/store';
import { paymentReady, reconcile } from '@/lib/commerce/payments';
import { itemTotals, lineTotal, rupees, type Line } from '@/lib/commerce/shared';
import { checkoutPromotion, type AppliedPromotion } from '@/lib/commerce/promotions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Secure checkout', robots: { index: false, follow: false }, referrer: 'no-referrer' as const };

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!validId(id)) notFound();
  let checkout = await getCheckout(id);
  if (!checkout) notFound();
  if (checkout.attempt && !checkout.order_id) {
    try { await reconcile(checkout); } catch { /* Payment can be checked again from this page. */ }
    checkout = (await getCheckout(id))!;
  }
  if (checkout.order_id) redirect('/orders/' + checkout.order_id);

  let lines: Line[];
  let shipping: number;
  let total: number;
  let offer: AppliedPromotion | null = null;
  let couponAccepted = false;
  const coupon = await checkoutPromotion(id);
  try {
    if (checkout.lines && checkout.shipping !== null && checkout.total !== null) {
      lines = JSON.parse(checkout.lines);
      shipping = checkout.shipping;
      total = checkout.total;
      offer = coupon?.snapshot ? JSON.parse(coupon.snapshot) : null;
    } else {
      ({ lines, shipping, total, offer, couponAccepted } = await quote(JSON.parse(checkout.cart), coupon?.code));
    }
  } catch {
    return <section className="wrap commerce-page">
      <RememberCheckout id={id} />
      <h1>Checkout</h1>
      <p>One or more items are currently unavailable. You can resume from My Account when they are back in stock.</p>
      <Link className="button outline" href="/account">My account</Link>
    </section>;
  }
  const products = await Promise.all(lines.map(async line => ({
    ...line,
    image: (await catalogueItem(line.sku))?.image,
  })));
  const { beforeTax, tax } = itemTotals(lines);
  const priced = Number.isSafeInteger(shipping) && shipping >= 0;
  return <section className="wrap commerce-page checkout-page">
    <RememberCheckout id={id} />
    <h1>Guest checkout</h1>
    <div className="checkout-layout">
    <section className="commerce-panel checkout-summary" aria-labelledby="checkout-summary-heading">
      <h2 id="checkout-summary-heading">Order summary</h2>
      {products.map(line => <div className="commerce-total commerce-checkout-product" key={line.sku}>
        <div className="commerce-cart-product">
          {line.image && <Image src={line.image} alt="" width={56} height={56} />}
          <span>{line.quantity} × {line.name}</span>
        </div>
        <strong>{rupees(lineTotal(line))}</strong>
      </div>)}
      <div className="commerce-total"><span>Items subtotal before GST</span><span>{rupees(beforeTax)}</span></div>
      <div className="commerce-total"><span>GST included in item prices</span><span>{rupees(tax)}</span></div>
      <div className="commerce-total"><span>Shipping</span><span>{priced ? rupees(shipping) : 'Being configured'}</span></div>
      <div className="commerce-total"><span>Secure packing</span><strong>FREE</strong></div>
      {offer && <div className="commerce-total"><span>Savings included · {offer.title}</span><strong>{rupees(offer.discount + offer.shippingDiscount)}</strong></div>}
      {priced && <div className="commerce-total"><strong>Total</strong><strong>{rupees(total)}</strong></div>}
      {!checkout.attempt && <>
        {coupon?.code && !couponAccepted && <p role="status">This coupon is no longer eligible. Remove it to continue.</p>}
        {coupon?.code && couponAccepted && offer?.code !== coupon.code && <p>We applied a better automatic offer.</p>}
        <CheckoutCoupon id={id} code={coupon?.code ?? null} />
      </>}
      <p>{await deliveryMessage()}</p>
      <Link className="text-link dark" href="/account">My account →</Link>
    </section>
    <div>
      <CheckoutForm id={id} total={priced ? total : 0} pending={Boolean(checkout.attempt)} ready={priced && paymentReady()} />
      <Link className="text-link dark" href="/policies">Ordering and support →</Link>
    </div>
    </div>
  </section>;
}
