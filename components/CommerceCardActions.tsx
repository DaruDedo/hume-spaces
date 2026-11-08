'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cardAvailability } from '@/app/commerce-actions';
import CommerceButtons from './CommerceButtons';
import WhatsAppButton from './WhatsAppButton';

type Availability = Awaited<ReturnType<typeof cardAvailability>>;
let pending: Promise<Availability> | undefined;

export default function CommerceCardActions({ sku, name, packHref, cartOnly = false }: { sku: string; name: string; packHref?: string; cartOnly?: boolean }) {
  const [products, setProducts] = useState<Availability>();

  useEffect(() => {
    let active = true;
    pending ??= cardAvailability().finally(() => { pending = undefined; });
    pending.then(result => { if (active) setProducts(result); }, () => { if (active) setProducts({}); });
    return () => { active = false; };
  }, []);

  if (!products) return <p className="commerce-card-status">Checking availability…</p>;
  const item = products[sku];
  if (item?.archived) return <span className="catalogue-archived" hidden />;
  if (packHref) return <Link className="button outline" href={packHref}>Choose pack size</Link>;
  if (!item?.online) return <WhatsAppButton topic={name} label="Enquire on WhatsApp" className="button outline" />;

  return <>
    {!item.available && <p className="commerce-card-status">Out of stock</p>}
    <CommerceButtons items={[{ sku, quantity: 1 }]} unavailable={!item.available} buyNow={!cartOnly} showCartLink={!cartOnly} />
  </>;
}
