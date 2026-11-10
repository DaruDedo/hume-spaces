import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { catalogueHref, catalogueItem, deliveryEstimate, oilSizes } from '@/lib/commerce/catalogue';
import CommercePurchase from '@/components/CommercePurchase';
import FragranceGallery from '@/components/FragranceGallery';
import OilPurchase from '@/components/OilPurchase';
import StoreCatalogue from '@/components/StoreCatalogue';
import WhatsAppButton from '@/components/WhatsAppButton';

export const dynamic = 'force-dynamic';

export default async function CatalogueProduct({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params;
  const item = await catalogueItem(sku);
  if (!item || item.archived) notFound();
  const url = catalogueHref(item.parent_sku ?? sku);
  if (item.parent_sku || !url.startsWith('/shop/')) redirect(url);
  const packs = item.category === 'oil' ? (await oilSizes(sku)).filter(pack => !pack.archived) : [];
  return <section className="wrap commerce-page">
    <div className="product-layout">
      {item.category === 'oil'
        ? <FragranceGallery name={item.name} images={[{ image: item.image.replace(/^\/images\/spaces\//, ''), label: 'Product image' }]} />
        : <Image src={item.image} alt={item.name} width={560} height={560} style={{ width: '100%', height: 'auto', borderRadius: 18 }} />}
      <div className="product-buy-panel">
        <h1>{item.name}</h1>
        <p>{item.description}</p>
        {item.category === 'oil'
          ? <OilPurchase packs={packs} />
          : <CommercePurchase sku={sku}><WhatsAppButton topic={item.name} label="Enquire on WhatsApp" /></CommercePurchase>}
        <p>{deliveryEstimate}</p>
      </div>
    </div>
    {item.category === 'oil' && <StoreCatalogue category="equipment" recommendations />}
  </section>;
}
