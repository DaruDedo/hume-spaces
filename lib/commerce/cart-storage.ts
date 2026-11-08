import { cartSchema, type Cart } from './shared';

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

export function saveCart(cart: Cart) {
  localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  window.dispatchEvent(new Event(cartUpdatedEvent));
}
export const openCartEvent = 'hume-open-cart';
