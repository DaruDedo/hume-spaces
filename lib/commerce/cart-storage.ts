import { cartSchema, type Cart } from './shared';
import type { cartDetails } from '@/app/commerce-actions';

export type CartDetails = Awaited<ReturnType<typeof cartDetails>>;

export const cartStorageKey = 'hume-cart';
export const cartUpdatedEvent = 'hume-cart-updated';

export function readCart(): Cart {
  try {
    const parsed = cartSchema.safeParse(JSON.parse(localStorage.getItem(cartStorageKey) ?? '[]'));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export function saveCart(cart: Cart, details?: CartDetails) {
  localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent(cartUpdatedEvent, { detail: details }));
}
export const openCartEvent = 'hume-open-cart';
