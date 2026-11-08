'use client';

import { useEffect, useRef, useState } from 'react';
import { cartStorageKey, cartUpdatedEvent, openCartEvent, readCart } from '@/lib/commerce/cart-storage';
import CartContents from './CartContents';

export default function HeaderCart() {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const drawer = useRef<HTMLDialogElement>(null);

  function openDrawer() {
    const dialog = drawer.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    setOpen(true);
  }

  useEffect(() => {
    const sync = () => setCount(readCart().reduce((total, line) => total + line.quantity, 0));
    const syncStorage = (event: StorageEvent) => {
      if (event.key === cartStorageKey || event.key === null) sync();
    };
    sync();
    window.addEventListener(cartUpdatedEvent, sync);
    window.addEventListener('storage', syncStorage);
    window.addEventListener('pageshow', sync);
    const openFromLink = (event: Event) => {
      if (!drawer.current) return;
      event.preventDefault();
      openDrawer();
    };
    window.addEventListener(openCartEvent, openFromLink);
    return () => {
      window.removeEventListener(cartUpdatedEvent, sync);
      window.removeEventListener('storage', syncStorage);
      window.removeEventListener('pageshow', sync);
      window.removeEventListener(openCartEvent, openFromLink);
    };
  }, []);

  return <>
  <button type="button" className="header-cart" aria-haspopup="dialog" aria-expanded={open}
    aria-controls="cart-drawer" onClick={openDrawer} aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}>
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 4h2l2.4 11h10.9l2-8H6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="19" r="1" /><circle cx="17" cy="19" r="1" />
    </svg>
    <span className="header-cart-label">Cart</span>
    {count > 0 && <span className="header-cart-count">{count}</span>}
  </button>
  <dialog id="cart-drawer" ref={drawer} className="cart-drawer" data-closing={closing}
    aria-labelledby="cart-drawer-title"
    onCancel={event => { event.preventDefault(); setClosing(true); }}
    onClick={event => { if (event.target === event.currentTarget) setClosing(true); }}
    onAnimationEnd={event => {
      if (closing && event.target === event.currentTarget) drawer.current?.close();
    }}
    onClose={() => { setOpen(false); setClosing(false); }}>
    <div className="cart-drawer-inner">
      <div className="cart-drawer-heading">
        <h2 id="cart-drawer-title">Your cart</h2>
        <button type="button" className="cart-drawer-close" aria-label="Close cart" onClick={() => setClosing(true)}>×</button>
      </div>
      <div className="cart-drawer-body">
        {open && <CartContents onNavigate={() => setClosing(true)} />}
      </div>
    </div>
  </dialog>
  </>;
}
