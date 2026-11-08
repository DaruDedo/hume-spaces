import { commerceStorageConfigured } from '@/lib/commerce/database';
import { connection } from 'next/server';
import { getStock } from '@/lib/commerce/store';
import { rupees } from '@/lib/commerce/shared';
import CommerceButtons from './CommerceButtons';

export default async function CommercePurchase({ sku, children }: { sku: string; children: React.ReactNode }) {
  await connection();
  // On a host without commerce storage, the existing enquiry flow remains available.
  if (!commerceStorageConfigured()) return children;
  const product = await getStock(sku);
  if (!product?.online) return children;
  return <div className="commerce-purchase">
    <div className="product-price-row">
      <p className="product-price">₹{(product.price / 100).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
      <span>{product.stock > 0 ? 'In stock' : 'Out of stock'}</span>
    </div>
    {product.wholesale_min > 0 && <p>{rupees(product.wholesale_price)} each when you buy {product.wholesale_min} or more.</p>}
    <CommerceButtons items={[{ sku, quantity: 1 }]} unavailable={product.stock === 0} />
  </div>;
}
