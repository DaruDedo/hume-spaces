import { catalogueHref, catalogueItems, oilSizes } from '@/lib/commerce/catalogue';
import { commerceStorageConfigured } from '@/lib/commerce/database';
import { rupees } from '@/lib/commerce/shared';
import { products as equipment } from '@/lib/content';
import CatalogueCard from './CatalogueCard';
import CommerceButtons from './CommerceButtons';
import PairingCarousel from './PairingCarousel';
import WhatsAppButton from './WhatsAppButton';

const pairingDiffusers = ['hume-commercial-scent-machine-pro', '800ml-commercial-diffuser', 'hume-pro-commercial-tower'];

export default async function StoreCatalogue({ category, recommendations = false }: {
  category: 'equipment' | 'oil'; recommendations?: boolean;
}) {
  const [catalogue, packs] = await Promise.all([
    catalogueItems(),
    category === 'oil' && commerceStorageConfigured() ? oilSizes() : [],
  ]);
  const startingPrices = new Map(packs.filter(pack => pack.grams === 50 && !pack.archived).map(pack => [pack.parent_sku, pack.price]));
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
      price: category === 'equipment' ? item.price : startingPrices.get(item.sku),
    }));
    return products.length ? <PairingCarousel category={category} products={products} /> : null;
  }
  const fragrance = category === 'oil';
  return <div className={`product-grid catalog store-catalogue-grid${fragrance ? ' fragrance-catalog' : ''}`}>
    {categoryItems.map(item => {
      const startingPrice = startingPrices.get(item.sku);
      const coverage = equipment.find(product => product.slug === item.sku)?.coverage;
      const footer = fragrance
        ? startingPrice !== undefined && <p className="product-price fragrance-starting-price">From {rupees(startingPrice)} <small>· 50 g</small></p>
        : item.online
          ? <CommerceButtons items={[{ sku: item.sku, quantity: 1 }]} unavailable={item.stock === 0} />
          : <WhatsAppButton topic={item.name} label="Enquire on WhatsApp" className="button outline" />;
      return <CatalogueCard key={item.sku} fragrance={fragrance} name={item.name.replace(/ · 100 mL$/, '')}
        href={catalogueHref(item.sku)} image={item.image} detail={coverage ? `Coverage: ${coverage}*` : item.description}
        price={!fragrance && <p className="product-price">{rupees(item.price)}</p>} footer={footer} />;
    })}
    {categoryItems.length === 0 && <p>No products are currently listed in this category.</p>}
  </div>;
}
