'use client';
import RowSelect from '@/components/RowSelect';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cartDetails, startCheckout } from '@/app/commerce-actions';
import { currentStorefrontVisit } from '@/lib/commerce/activity-session';
import { cartStorageKey, cartUpdatedEvent, readCart, saveCart, type CartDetails } from '@/lib/commerce/cart-storage';
import { itemTotals, rupees, unitPrice, type Cart } from '@/lib/commerce/shared';

export default function CartContents({ onNavigate, refreshKey }: { onNavigate?: () => void; refreshKey?: number }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [resolved, setResolved] = useState<CartDetails>([]);
  const [loadError, setLoadError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const sync = () => setCart(readCart());
    const syncUpdate = (event: Event) => {
      const updated = (event as CustomEvent<CartDetails | undefined>).detail;
      if (updated) setResolved(updated);
      sync();
    };
    const syncStorage = (event: StorageEvent) => {
      if (event.key === cartStorageKey || event.key === null) sync();
    };
    sync();
    window.addEventListener(cartUpdatedEvent, syncUpdate);
    window.addEventListener('storage', syncStorage);
    window.addEventListener('pageshow', sync);
    return () => {
      window.removeEventListener(cartUpdatedEvent, syncUpdate);
      window.removeEventListener('storage', syncStorage);
      window.removeEventListener('pageshow', sync);
    };
  }, []);
  useEffect(() => {
    if (!cart?.length) return;
    let active = true;
    setLoadError(false);
    cartDetails(cart).then(result => { if (active) setResolved(result); })
      .catch(() => { if (active) setLoadError(true); });
    return () => { active = false; };
  }, [cart, refreshKey]);

  function change(sku: string, quantity: number) {
    const next = readCart().flatMap(item => item.sku !== sku ? [item] : quantity > 0 ? [{ ...item, quantity }] : []);
    saveCart(next);
    setMessage('');
  }

  async function checkout() {
    if (!cart?.length) return;
    setBusy(true);
    try {
      const result = await startCheckout(cart, 'cart', currentStorefrontVisit());
      if (result.url) {
        try { sessionStorage.setItem('hume-cart-checkout:' + result.url.split('/').at(-1), JSON.stringify(cart)); } catch {}
        window.location.assign(result.url);
      } else setMessage(result.error ?? 'Unable to start checkout.');
    } catch {
      setMessage('Unable to start checkout. Try again.');
    } finally {
      setBusy(false);
    }
  }

  const details = (cart ?? []).flatMap(item => {
    const line = resolved.find(entry => entry.sku === item.sku);
    return line ? [{ ...line, quantity: item.quantity }] : [];
  });
  const loading = !cart || details.length !== cart.length;
  const available = details.length > 0 && details.every(({ product, quantity }) => product?.online && product.stock >= quantity);
  const offerFragrance = !loading && details.some(line => line.category === 'equipment') && !details.some(line => line.category === 'oil');
  const totals = itemTotals(details.flatMap(({ product, quantity }) =>
    product ? [{ price: unitPrice(product, quantity), quantity, tax: product.tax }] : []));
  return <>
    {loading && !loadError && <div className="commerce-panel cart-placeholder" role="status" aria-label="Loading cart" />}
    {loadError && loading && <p role="status">Could not load cart availability. Refresh to try again.</p>}
    {cart?.length === 0 && <div className="commerce-panel"><p>Your cart is empty.</p><Link className="button" href="/shop" onNavigate={onNavigate}>Continue shopping</Link></div>}
    {details.map(({ sku, quantity, product, href, image }) => <div className="commerce-row" key={sku}>
      <div className="commerce-cart-product">
        {image && <Image src={image} alt="" width={64} height={64} />}
        <div><Link href={href} onNavigate={onNavigate}><strong>{product?.name ?? sku}</strong></Link>
          <p>{product ? rupees(unitPrice(product, quantity)) + ' each' : 'Unavailable'} · {product?.online && product.stock >= quantity ? 'In stock' : 'Quantity unavailable'}</p></div>
      </div>
      <label>Quantity
        <RowSelect value={quantity} onValueChange={value => change(sku, Number(value))}>
          {Array.from({ length: Math.min(99, Math.max(quantity, product?.stock ?? 0)) }, (_, i) => <option key={i + 1}>{i + 1}</option>)}
        </RowSelect>
      </label>
      {product && <strong>{rupees(unitPrice(product, quantity) * quantity)}</strong>}
      <button className="text-link dark" type="button" aria-label={'Remove ' + (product?.name ?? sku)} onClick={() => change(sku, 0)}>Remove</button>
    </div>)}
    {offerFragrance && <div className="commerce-panel cart-fragrance-offer">
      <p>Choose a fragrance oil for your diffuser.</p>
      <Link className="button outline" href="/fragrance-oils" onNavigate={onNavigate}>Add fragrance oil</Link>
    </div>}
    {!loading && details.length > 0 && <div className="commerce-panel">
      <div className="commerce-total"><span>Items subtotal before GST</span><span>{rupees(totals.beforeTax)}</span></div>
      <div className="commerce-total"><span>GST included in item prices</span><span>{rupees(totals.tax)}</span></div>
      <div className="commerce-total"><span>Items total</span><strong>{rupees(totals.subtotal)}</strong></div>
      <p>Shipping is shown at checkout.</p>
      <div className="commerce-actions">
        <button className="button" disabled={busy || loading || !available} onClick={checkout}>{busy ? 'Opening checkout…' : 'Checkout'}</button>
        <Link className="text-link dark" href="/shop" onNavigate={onNavigate}>Continue shopping</Link>
      </div>
    </div>}
    <p role="status">{message}</p>
  </>;
}
