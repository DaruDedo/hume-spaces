'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cartDetails, startCheckout } from '@/app/commerce-actions';
import { currentStorefrontVisit } from '@/lib/commerce/activity-session';
import { cartSchema, type Cart } from '@/lib/commerce/shared';
import { openCartEvent, readCart, saveCart } from '@/lib/commerce/cart-storage';
import FragranceCartPrompt from './FragranceCartPrompt';

export default function CommerceButtons({ items, label = 'Add to Cart', buyNow = true, showCartLink = true, unavailable = false }: {
  items: Cart; label?: string; buyNow?: boolean; showCartLink?: boolean; unavailable?: boolean;
}) {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [showFragrancePrompt, setShowFragrancePrompt] = useState(false);

  async function add() {
    setBusy(true);
    try {
      const cart = readCart();
      const before = JSON.stringify(cart);
      for (const item of items) {
        const existing = cart.find(line => line.sku === item.sku);
        if (existing) existing.quantity += item.quantity;
        else cart.push({ ...item });
      }
      const parsed = cartSchema.safeParse(cart);
      if (!parsed.success) return setMessage('Your cart has reached its item or quantity limit.');
      const details = await cartDetails(parsed.data);
      const added = details.filter(line => items.some(item => item.sku === line.sku));
      if (added.length !== items.length || added.some(line => !line.product?.online || line.product.stock < line.quantity)) {
        return setMessage('Some items are unavailable in the requested quantity.');
      }
      if (JSON.stringify(readCart()) !== before) return setMessage('Your cart changed. Try adding these items again.');
      saveCart(parsed.data, details);
      setMessage('Added to your cart.');
      if (added.some(line => line.category === 'equipment') && !details.some(line => line.category === 'oil')) {
        setShowFragrancePrompt(true);
      }
    } catch {
      setMessage('Unable to update the cart. Try again.');
    } finally {
      setBusy(false);
    }
  }

  async function buy() {
    setBusy(true);
    try {
      const result = await startCheckout(items, 'buy', currentStorefrontVisit());
      if (result.url) window.location.assign(result.url);
      else setMessage(result.error ?? 'Unable to start checkout.');
    } catch {
      setMessage('Unable to start checkout. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return <><div className="commerce-actions">
    <button type="button" className="button outline" onClick={add} disabled={busy || unavailable}>{label}</button>
    {buyNow && <button type="button" className="button" onClick={buy} disabled={busy || unavailable}>{busy ? 'Opening…' : 'Buy Now'}</button>}
    {showCartLink && <Link className="text-link dark" href="/cart" onNavigate={event => {
      if (!window.dispatchEvent(new Event(openCartEvent, { cancelable: true }))) event.preventDefault();
    }}>View cart</Link>}
    <div role="status">{message}</div>
  </div>
  {showFragrancePrompt && <FragranceCartPrompt onClose={() => setShowFragrancePrompt(false)} />}
  </>;
}
