'use client';

import { useEffect } from 'react';
import { readCart, saveCart } from '@/lib/commerce/cart-storage';

export default function CompletedCart({ checkoutId }: { checkoutId: string }) {
  useEffect(() => {
    try {
      const key = 'hume-cart-checkout:' + checkoutId;
      const snapshot = sessionStorage.getItem(key);
      if (snapshot && snapshot === JSON.stringify(readCart())) saveCart([]);
      sessionStorage.removeItem(key);
    } catch {
      // The browser can block access to local storage.
    }
  }, [checkoutId]);
  return null;
}
