import Image from 'next/image';
import Link from 'next/link';
import { catalogueHref, catalogueItems } from '@/lib/commerce/catalogue';
import { rupees } from '@/lib/commerce/shared';
import CommerceButtons from './CommerceButtons';
import WhatsAppButton from './WhatsAppButton';

export default async function StoreCatalogue({ category }: { category: 'equipment' | 'oil' }) {
  const items = (await catalogueItems()).filter(item => item.category === category);
  return <div className="product-grid catalog store-catalogue-grid">
    {items.map(item => <article className="product-card" key={item.sku}>
      <div className="product-image"><Image src={item.image} alt={item.name} fill sizes="(max-width: 750px) 45vw, 30vw" /></div>
      <h3><Link className="product-card-link" href={catalogueHref(item.sku)}>{item.name.replace(/ · 100 mL$/, '')}</Link></h3>
      <p className="store-card-description">{item.description}</p>
      {category === 'equipment' && <p className="product-price">{rupees(item.price)}</p>}
      <div className="simple-card-actions">
        {category === 'oil'
          ? <Link className="button outline" href={catalogueHref(item.sku)}>Choose pack size</Link>
          : item.online
            ? <CommerceButtons items={[{ sku: item.sku, quantity: 1 }]} unavailable={item.stock === 0} />
            : <WhatsAppButton topic={item.name} label="Enquire on WhatsApp" className="button outline" />}
      </div>
    </article>)}
    {items.length === 0 && <p>No products are currently listed in this category.</p>}
  </div>;
}
