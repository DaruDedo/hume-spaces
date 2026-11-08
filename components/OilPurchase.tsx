'use client';
import RowSelect from '@/components/RowSelect';

import { useState } from 'react';
import { rupees } from '@/lib/commerce/shared';
import { oilWeightLabel } from '@/lib/commerce/oil-sizes';
import CommerceButtons from './CommerceButtons';

type Pack = { sku: string; grams: number; price: number; online: number; stock: number };

export default function OilPurchase({ packs }: { packs: Pack[] }) {
  const [sku, setSku] = useState('');
  const selected = packs.find(pack => pack.sku === sku);
  return <div className="commerce-purchase">
    <label>Pack size
      <RowSelect value={sku} onValueChange={setSku}>
        <option value="">Choose a weight</option>
        {packs.map(pack => <option key={pack.sku} value={pack.sku}>
          {oilWeightLabel(pack.grams)} · {pack.online ? rupees(pack.price) : 'Unavailable'}
        </option>)}
      </RowSelect>
    </label>
    {selected?.online
      ? <div key={selected.sku}>
          <p>{rupees(selected.price)} · {selected.stock > 0 ? 'In stock' : 'Out of stock'}</p>
          <CommerceButtons items={[{ sku: selected.sku, quantity: 1 }]} unavailable={selected.stock === 0} />
        </div>
      : selected && <p>This pack size is currently unavailable.</p>}
  </div>;
}
