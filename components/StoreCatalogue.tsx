import Image from 'next/image';
import Link from 'next/link';
import { catalogueHref, catalogueItems, oilSizes } from '@/lib/commerce/catalogue';
import { commerceStorageConfigured } from '@/lib/commerce/database';
import { rupees } from '@/lib/commerce/shared';
import CommerceButtons from './CommerceButtons';
import PairingCarousel from './PairingCarousel';
import WhatsAppButton from './WhatsAppButton';

const pairingDiffusers = ['hume-commercial-scent-machine-pro', '800ml-commercial-diffuser', 'hume-pro-commercial-tower'];

export default async function StoreCatalogue({ category, recommendations = false }: {
  category: 'equipment' | 'oil'; recommendations?: boolean;
}) {
  const [catalogue, packs] = await Promise.all([
    catalogueItems(),
    recommendations && category === 'oil' && commerceStorageConfigured() ? oilSizes() : [],
  ]);
  const categoryItems = catalogue.filter(item => item.category === category);
  if (recommendations) {
    const availableOils = new Set(packs.filter(pack => !pack.archived && pack.online && pack.stock > 0)
      .map(pack => pack.parent_sku));
    const recommended = category === 'oil'
      ? categoryItems.filter(item => availableOils.has(item.sku))
      : pairingDiffusers.flatMap(sku => categoryItems.filter(item => item.sku === sku && item.online && item.stock > 0));
    const products = recommended.map(item => ({
      sku: item.sku,
      name: item.name.replace(/ · 100 mL$/, ''),
      image: item.image,
      description: item.description,
      href: catalogueHref(item.sku),
      price: category === 'equipment' ? item.price : undefined,
    }));
    return products.length ? <PairingCarousel category={category} products={products} /> : null;
  }
  return <div className="product-grid catalog store-catalogue-grid">
    {categoryItems.map(item => <article className="product-card" key={item.sku}>
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
    {categoryItems.length === 0 && <p>No products are currently listed in this category.</p>}
  </div>;
}
