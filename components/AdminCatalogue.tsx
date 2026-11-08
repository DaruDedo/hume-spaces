import RowSelect from '@/components/RowSelect';
import { archiveSku, createSku, updateSku } from '@/app/admin/actions';
import { catalogueItems, oilSizes, type CatalogueItem } from '@/lib/commerce/catalogue';
import { oilWeightLabel } from '@/lib/commerce/oil-sizes';
import { defaultGstRate } from '@/lib/commerce/shared';

function ProductFields({ item, pack = false }: { item?: CatalogueItem; pack?: boolean }) {
  const parentOil = item?.category === 'oil' && !pack;
  return <div className="commerce-fields">
    {item ? <input type="hidden" name="sku" value={item.sku} /> : <label>SKU<input name="sku" placeholder="e.g. citrus-oil" required /></label>}
    <label>Name<input name="name" defaultValue={item?.name} required /></label>
    {item ? <input type="hidden" name="category" value={item.category} /> : <label>Category<RowSelect name="category"><option value="equipment">Equipment</option><option value="oil">Fragrance oil</option></RowSelect></label>}
    <label>Description<textarea name="description" defaultValue={item?.description} maxLength={2000} required /></label>
    <label>Image path<input name="image" defaultValue={item?.image ?? '/images/spaces/hume-spaces-hero.png'} required /></label>
    <label>{parentOil ? 'Catalogue reference price (₹)' : 'Tax-inclusive price (₹)'}<input name="price" type="number" min="0.01" step="0.01" defaultValue={pack && item?.price === 1 && !item.online ? undefined : item && item.price / 100} required /></label>
    <label>{item ? 'Stock adjustment' : 'Opening stock'}<input name="stockChange" type="number" defaultValue="0" required /></label>
    <label>GST included (%)<input name="tax" type="number" min="0" max="100" step="0.01" defaultValue={(item?.tax ?? defaultGstRate) / 100} required /></label>
    <label>Purchase mode<RowSelect name="online" defaultValue={String(parentOil ? 0 : item?.online ?? 0)}><option value="0">Enquiry</option>{!parentOil && <option value="1">Online purchase</option>}</RowSelect></label>
    <label>Wholesale minimum (0 to disable)<input name="wholesaleMin" type="number" min="0" max="99" defaultValue={item?.wholesale_min ?? 0} required /></label>
    <label>Wholesale unit price (₹)<input name="wholesalePrice" type="number" min="0" step="0.01" defaultValue={(item?.wholesale_price ?? 0) / 100} required /></label>
  </div>;
}

function ArchiveProduct({ item }: { item: CatalogueItem }) {
  return <form action={archiveSku} className="commerce-form">
    <input type="hidden" name="sku" value={item.sku} />
    <input type="hidden" name="archived" value={item.archived ? '0' : '1'} />
    <button className="button outline">{item.archived ? 'Restore listing' : 'Remove from catalogue'}</button>
  </form>;
}

export default async function AdminCatalogue() {
  const [products, variants] = await Promise.all([catalogueItems(true), oilSizes()]);
  return <section id="catalogue">
    <h2>Catalogue, stock and taxes</h2>
    <p>Remove a listing to hide it from customers while preserving past orders. You can restore it here.</p>
    <details className="commerce-panel">
      <summary>Add product or fragrance</summary>
      <form action={createSku} className="commerce-form">
        <ProductFields />
        <p>New fragrances get five pack sizes. Set the price and stock for each size after creating the fragrance.</p>
        <button className="button">Create listing</button>
      </form>
    </details>
    {products.map(item => <details className="commerce-panel" key={item.sku}>
      <summary>{item.name} · {item.archived ? 'Removed' : item.category === 'oil' ? '5 pack sizes' : item.stock + ' available'}</summary>
      <form action={updateSku} className="commerce-form">
        <p>SKU {item.sku}</p>
        <ProductFields item={item} />
        <button className="button">Save listing</button>
      </form>
      {variants.filter(pack => pack.parent_sku === item.sku).map(pack => <details className="commerce-panel" key={pack.sku}>
        <summary>{oilWeightLabel(pack.grams)} · {pack.archived ? 'Removed' : pack.stock + ' available'}</summary>
        <form action={updateSku} className="commerce-form">
          <ProductFields item={pack} pack />
          <button className="button">Save pack size</button>
        </form>
        <ArchiveProduct item={pack} />
      </details>)}
      <ArchiveProduct item={item} />
    </details>)}
  </section>;
}
