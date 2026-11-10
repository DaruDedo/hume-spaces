'use client';

import { useState } from 'react';
import { rupees } from '@/lib/commerce/shared';
import { oilWeightLabel } from '@/lib/commerce/oil-sizes';
import CommerceButtons from './CommerceButtons';

type Pack = { sku: string; grams: number; price: number; online: number; stock: number };

export default function OilPurchase({ packs }: { packs: Pack[] }) {
  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
  const selected = packs.filter(pack => pack.online && pack.stock > 0 && selectedSkus.includes(pack.sku));
  return <div className="commerce-purchase">
    {packs.length > 0 && <fieldset className="oil-pack-options">
      <legend>Pack size <span>Choose one or more</span></legend>
      <div className="oil-pack-grid">
        {packs.map(pack => {
          const active = selectedSkus.includes(pack.sku);
          const available = pack.online > 0 && pack.stock > 0;
          return <button key={pack.sku} type="button" aria-pressed={active} disabled={!available}
            onClick={() => setSelectedSkus(current => current.includes(pack.sku)
              ? current.filter(sku => sku !== pack.sku)
              : [...current, pack.sku])}>
            <strong>{oilWeightLabel(pack.grams)}</strong>
            {available && <span className="oil-pack-icon" aria-hidden="true">{active ? '✓' : '+'}</span>}
            <span className="oil-pack-price">{pack.online ? rupees(pack.price) : 'Unavailable'}</span>
            {pack.online > 0 && pack.stock <= 0 && <small>Out of stock</small>}
          </button>;
        })}
      </div>
    </fieldset>}
    {selected.length > 0 && <CommerceButtons items={selected.map(pack => ({ sku: pack.sku, quantity: 1 }))} />}
  </div>;
}
