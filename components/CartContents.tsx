'use client';
import RowSelect from '@/components/RowSelect';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cartDetails, startCheckout } from '@/app/commerce-actions';
import { cartStorageKey, cartUpdatedEvent, readCart, saveCart } from '@/lib/commerce/cart-storage';
import { itemTotals, rupees, unitPrice, type Cart } from '@/lib/commerce/shared';

export default function CartContents({ onNavigate }: { onNavigate?: () => void }) {
  const [cart, setCart] = useState<Cart>([]);
  const [details, setDetails] = useState<Awaited<ReturnType<typeof cartDetails>>>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const sync = () => setCart(readCart());
    const syncStorage = (event: StorageEvent) => {
      if (event.key === cartStorageKey || event.key === null) sync();
    };
    sync();
    window.addEventListener(cartUpdatedEvent, sync);
    window.addEventListener('storage', syncStorage);
    return () => {
      window.removeEventListener(cartUpdatedEvent, sync);
      window.removeEventListener('storage', syncStorage);
    };
  }, []);
  useEffect(() => {
    let active = true;
    setLoading(true);
    cartDetails(cart).then(result => { if (active) setDetails(result); })
      .catch(() => {
        if (!active) return;
        setDetails([]);
        setMessage('Could not load cart availability. Refresh to try again.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [cart]);

  function change(sku: string, quantity: number) {
    const next = cart.flatMap(item => item.sku !== sku ? [item] : quantity > 0 ? [{ ...item, quantity }] : []);
    saveCart(next);
    setMessage('');
  }

  async function checkout() {
    setBusy(true);
    try {
      const result = await startCheckout(cart, 'cart');
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

  const available = details.length > 0 && details.every(({ product, quantity }) => product?.online && product.stock >= quantity);
  const totals = itemTotals(details.flatMap(({ product, quantity }) =>
    product ? [{ price: unitPrice(product, quantity), quantity, tax: product.tax }] : []));
  return <>
    {loading && <p>Checking availability…</p>}
    {!loading && cart.length === 0 && <div className="commerce-panel"><p>Your cart is empty.</p><Link className="button" href="/shop" onNavigate={onNavigate}>Continue shopping</Link></div>}
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
    {details.length > 0 && <div className="commerce-panel">
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
