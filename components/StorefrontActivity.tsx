'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { cartUpdatedEvent, readCart } from '@/lib/commerce/cart-storage';
import { analyticsEnabled, visitWindow as sessionWindow } from '@/lib/commerce/activity-session';
const privatePage = /^\/(admin|checkout|orders|account)(\/|$)/;

function identifiers() {
  const now = Date.now();
  const previous = sessionStorage.getItem('hume-visit');
  const lastSeen = Number(sessionStorage.getItem('hume-visit-time'));
  const resumed = previous && now - lastSeen < sessionWindow;
  const visit = resumed ? previous : crypto.randomUUID();
  const referrer = document.referrer ? new URL(document.referrer) : null;
  const incoming = referrer && referrer.origin !== location.origin ? referrer.hostname : 'direct';
  const source = resumed ? sessionStorage.getItem('hume-visit-source') ?? incoming : incoming;
  const cartId = localStorage.getItem('hume-cart-activity') ?? crypto.randomUUID();
  sessionStorage.setItem('hume-visit', visit);
  sessionStorage.setItem('hume-visit-time', String(now));
  sessionStorage.setItem('hume-visit-source', source);
  localStorage.setItem('hume-cart-activity', cartId);
  return { visit, cartId, source };
}

export default function StorefrontActivity() {
  const path = usePathname();
  const previous = useRef('');
  useEffect(() => {
    const isPrivate = privatePage.test(path);
    if (isPrivate) previous.current = '';
    function send(kind: 'page_view' | 'click' | 'cart_update' | 'planner_result' | 'withdraw') {
      try {
        if (kind !== 'withdraw' && !analyticsEnabled()) return;
        const ids = kind === 'withdraw'
          ? { visit: sessionStorage.getItem('hume-visit'), cartId: localStorage.getItem('hume-cart-activity'), source: 'direct' }
          : identifiers();
        if (!ids.visit || !ids.cartId) return;
        void fetch('/api/storefront-activity', {
          method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...ids, id: crypto.randomUUID(), kind, path: isPrivate ? '/cart' : path,
            device: matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop',
            ...(kind === 'cart_update' ? { cart: readCart() } : {}),
          }),
        }).catch(() => undefined);
      } catch {
        // Browsing and shopping continue if storage or analytics is unavailable.
      }
    }
    function view() {
      if (isPrivate) return;
      if (previous.current === path) return;
      if (!analyticsEnabled()) return;
      previous.current = path;
      send('page_view');
    }
    function preferences(event: Event) {
      if ((event as CustomEvent<string>).detail === 'declined') {
        previous.current = '';
        send('withdraw');
      } else {
        view();
        if (readCart().length) send('cart_update');
      }
    }
    function cart() { send('cart_update'); }
    function planner() { if (!isPrivate) send('planner_result'); }
    function click(event: MouseEvent) {
      if (!isPrivate && event.isTrusted && event.target instanceof Element && event.target.closest('a[href], button, summary')) {
        send('click');
      }
    }
    try { view(); } catch { /* Storage may be disabled. */ }
    window.addEventListener(cartUpdatedEvent, cart);
    window.addEventListener('hume-analytics-choice', preferences);
    window.addEventListener('hume-planner-result', planner);
    document.addEventListener('click', click, true);
    return () => {
      window.removeEventListener(cartUpdatedEvent, cart);
      window.removeEventListener('hume-analytics-choice', preferences);
      window.removeEventListener('hume-planner-result', planner);
      document.removeEventListener('click', click, true);
    };
  }, [path]);
  return null;
}
