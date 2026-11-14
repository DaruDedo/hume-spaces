import Link from '@/components/PageProgress';
import { commerceStorageConfigured } from '@/lib/commerce/database';
import { publicPromotions } from '@/lib/commerce/promotions';
import { rupees } from '@/lib/commerce/shared';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Offers' };

export default async function OffersPage() {
  const offers = commerceStorageConfigured() ? await publicPromotions() : [];
  return <section className="wrap commerce-page">
    <h1>Offers</h1>
    {offers.length ? offers.map(({ id, title, code, description, ends, kind, value, minimum, quantity, cap, scope }) => <article className="commerce-panel" key={id}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      <p><strong>{kind === 'percent' ? `${value / 100}% off` : kind === 'fixed' ? `${rupees(value)} off` :
        cap ? `Up to ${rupees(cap)} off shipping` : 'Free shipping'}</strong>
        {scope !== 'all' && <> · {scope === 'oil' ? 'Fragrance oils' : scope === 'equipment' ? 'Diffusers' : 'Selected products'}</>}
        {minimum > 0 && <> · {rupees(minimum)} minimum eligible spend</>}
        {quantity > 0 && <> · {quantity} eligible {quantity === 1 ? 'item' : 'items'} minimum</>}
        {cap > 0 && kind !== 'shipping' && <> · Up to {rupees(cap)} in savings</>}
      </p>
      <p>{code ? <>Use code <strong>{code}</strong> at checkout.</> : 'Applied automatically to eligible orders.'}</p>
      {ends && <p>Ends {new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(ends)} IST</p>}
    </article>) : <p>There are no published offers right now.</p>}
    <Link className="button" href="/shop">Shop products</Link>
  </section>;
}
