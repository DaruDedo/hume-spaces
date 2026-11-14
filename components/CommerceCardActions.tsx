'use client';

import { useEffect, useState } from 'react';
import { cardAvailability } from '@/app/commerce-actions';
import { rupees } from '@/lib/commerce/shared';
import CommerceButtons from './CommerceButtons';
import WhatsAppButton from './WhatsAppButton';

type Availability = Awaited<ReturnType<typeof cardAvailability>>;
let pending: Promise<Availability> | undefined;

export default function CommerceCardActions({ sku, name, oilStartingPrice, cartOnly = false }: { sku: string; name: string; oilStartingPrice?: number; cartOnly?: boolean }) {
  const [products, setProducts] = useState<Availability>();

  useEffect(() => {
    let active = true;
    pending ??= cardAvailability().finally(() => { pending = undefined; });
    pending.then(result => { if (active) setProducts(result); }, () => { if (active) setProducts({}); });
    return () => { active = false; };
  }, []);

  const item = products?.[sku];
  if (item?.archived) return <span className="catalogue-archived" hidden />;
  if (oilStartingPrice !== undefined) {
    const pack = products?.[sku + '-50g'];
    return pack?.archived ? null : <p className="product-price fragrance-starting-price">From {rupees(pack?.price ?? oilStartingPrice)} <small>· 50 g</small></p>;
  }
  if (!products) return <p className="commerce-card-status">Checking availability…</p>;
  if (!item?.online) return <WhatsAppButton topic={name} label="Enquire on WhatsApp" className="button outline" />;

  return <>
    {!item.available && <p className="commerce-card-status">Out of stock</p>}
    <CommerceButtons items={[{ sku, quantity: 1 }]} unavailable={!item.available} buyNow={!cartOnly} showCartLink={!cartOnly} />
  </>;
}
