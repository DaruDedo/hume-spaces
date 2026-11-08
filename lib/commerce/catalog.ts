import { products, scents } from '@/lib/content';
import { fragranceSlug } from '@/lib/fragrances';

export const enquiryEquipment = ['hume-mini-reed-diffuser-50ml', 'car-room-diffuser', 'hume-hvac-scenting-system'] as const;

export const commerceCatalog = [
  ...products.map(product => ({
    sku: product.slug,
    name: product.name,
    price: product.price * 100,
    online: !enquiryEquipment.some(sku => sku === product.slug),
    href: '/equipment/' + product.slug,
    image: '/images/spaces/' + product.image,
    category: 'equipment',
    description: product.description,
  })),
  ...scents.map(scent => ({
    sku: 'oil-' + fragranceSlug(scent.id),
    name: scent.name + ' Fragrance Oil',
    price: scent.price * 100,
    online: false,
    href: '/fragrance-oils/' + fragranceSlug(scent.id),
    image: '/images/spaces/' + scent.image,
    category: 'oil',
    description: scent.notes,
  })),
];
