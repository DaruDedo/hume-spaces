import { z } from 'zod';

export const cartSchema = z.array(z.object({
  sku: z.string().min(1).max(150),
  quantity: z.number().int().min(1).max(99),
})).min(1).max(50).refine(items => new Set(items.map(item => item.sku)).size === items.length);

export type Cart = z.infer<typeof cartSchema>;
export type StockItem = {
  sku: string; name: string; price: number; stock: number; online: number; tax: number;
  wholesale_min: number; wholesale_price: number;
};
export const unitPrice = (item: StockItem, quantity: number) =>
  item.wholesale_min > 0 && quantity >= item.wholesale_min ? item.wholesale_price : item.price;
export type Line = Cart[number] & { name: string; price: number; tax: number };
export const defaultGstRate = 1800;

export function itemTotals(lines: Pick<Line, 'price' | 'quantity' | 'tax'>[]) {
  let subtotal = 0;
  let tax = 0;
  for (const line of lines) {
    const gross = line.price * line.quantity;
    subtotal += gross;
    tax += Math.round(gross * line.tax / (10000 + line.tax));
  }
  return { subtotal, tax, beforeTax: subtotal - tax };
}
export const gstBillingSchema = z.object({
  gstin: z.string().trim().toUpperCase().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/),
  businessName: z.string().trim().min(2).max(150),
  billingAddress: z.string().trim().min(5).max(250),
});
export const deliverySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().regex(/^\+?[0-9 ()-]{10,18}$/),
  address: z.string().trim().min(5).max(250),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100),
  pin: z.string().trim().regex(/^[1-9]\d{5}$/),
  gstBilling: gstBillingSchema.optional(),
});
export type Delivery = z.infer<typeof deliverySchema>;
export const rupees = (paise: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(paise / 100);

export const orderStates = ['paid', 'packed', 'shipped', 'refund_pending', 'refunded'] as const;
export type OrderState = typeof orderStates[number];
