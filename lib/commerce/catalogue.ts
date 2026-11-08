import { commerceCatalog } from './catalog';
import { commerceStorageConfigured, db } from './database';
import { defaultGstRate, type StockItem } from './shared';
import { oilWeightLabel, oilWeights } from './oil-sizes';

export type CatalogueItem = StockItem & {
  category: 'equipment' | 'oil';
  description: string;
  image: string;
  archived: number;
  parent_sku: string | null;
};

export const catalogueHref = (sku: string) =>
  commerceCatalog.find(item => item.sku === sku)?.href ?? '/shop/' + encodeURIComponent(sku);

const select = `SELECT sku.*, catalogue.category, catalogue.description, catalogue.image, catalogue.archived,
  (SELECT parent_sku FROM oil_sizes WHERE oil_sizes.sku=sku.sku) AS parent_sku FROM sku JOIN catalogue USING(sku)`;

export async function catalogueItem(sku: string) {
  if (!commerceStorageConfigured()) return undefined;
  return db().prepare(select + ' WHERE sku.sku=?').get<CatalogueItem>(sku);
}

export async function catalogueItems(includeArchived = false) {
  if (!commerceStorageConfigured()) return [];
  return db().prepare(select + ' WHERE NOT EXISTS (SELECT 1 FROM oil_sizes WHERE oil_sizes.sku=sku.sku)'
    + (includeArchived ? '' : ' AND catalogue.archived=0') + ' ORDER BY category,name').all<CatalogueItem>();
}

export async function oilSizes(parentSku?: string) {
  const query = select.replace('SELECT sku.*,', 'SELECT sku.*, oil_sizes.grams,')
    + ' JOIN oil_sizes ON oil_sizes.sku=sku.sku'
    + (parentSku === undefined ? '' : ' WHERE oil_sizes.parent_sku=?') + ' ORDER BY grams';
  const packs = await db().prepare(query).all<CatalogueItem & { grams: number }>(...(parentSku === undefined ? [] : [parentSku]));
  return packs.map(pack => ({ ...pack }));
}

// New sizes start as enquiry items until staff enter their selling prices.
export async function createOilSizes(parentSku: string, name: string, description: string, image: string) {
  for (const grams of oilWeights) {
    const sku = parentSku + '-' + grams + 'g';
    const result = await db().prepare('INSERT INTO sku (sku,name,price,stock,online,tax) VALUES (?,?,1,0,0,?) ON CONFLICT(sku) DO NOTHING')
      .run(sku, name + ' · ' + oilWeightLabel(grams), defaultGstRate);
    if (!result.changes) throw new Error('A pack SKU already exists.');
    await db().prepare("INSERT INTO catalogue (sku,category,description,image) VALUES (?,'oil',?,?)").run(sku, description, image);
    await db().prepare('INSERT INTO oil_sizes (sku,parent_sku,grams) VALUES (?,?,?)').run(sku, parentSku, grams);
  }
}

export const deliveryEstimate = 'Estimated delivery in 5–7 days, depending on your location.';
