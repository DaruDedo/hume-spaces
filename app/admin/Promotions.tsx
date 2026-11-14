import RowSelect from '@/components/RowSelect';
import { db } from '@/lib/commerce/store';
import type { Promotion } from '@/lib/commerce/promotions';
import { rupees } from '@/lib/commerce/shared';
import { archivePromotion, savePromotion } from './actions';

function indiaDate(timestamp?: number | null) {
  return timestamp ? new Date(timestamp + 330 * 60000).toISOString().slice(0, 16) : '';
}

function Editor({ rule }: { rule?: Promotion }) {
  return <form action={savePromotion} className="commerce-form">
    <input type="hidden" name="id" value={rule?.id ?? ''} />
    <div className="commerce-fields">
      <label>Offer name<input name="title" maxLength={80} defaultValue={rule?.title} required /></label>
      <label>Coupon code (optional)<input name="code" maxLength={32} defaultValue={rule?.code ?? ''} placeholder="Blank for automatic offers" /></label>
      <label className="checkout-wide">Customer-facing terms<textarea name="description" maxLength={240} defaultValue={rule?.description} rows={2} /></label>
      <label>Discount type<RowSelect name="kind" defaultValue={rule?.kind ?? 'percent'}>
        <option value="percent">Percentage off</option>
        <option value="fixed">Fixed amount off</option>
        <option value="shipping">Shipping discount</option>
      </RowSelect></label>
      <label>Discount value (% or ₹)<input type="number" name="value" min={0} step=".01" defaultValue={(rule?.value ?? 0) / 100} /></label>
      <label>Applies to<RowSelect name="scope" defaultValue={rule?.scope ?? 'all'}>
        <option value="all">Entire cart</option>
        <option value="equipment">Diffusers</option>
        <option value="oil">Fragrance oils</option>
        <option value="sku">Specific SKUs</option>
      </RowSelect></label>
      <label>Eligible SKUs (comma-separated)<input name="skus" defaultValue={rule && (JSON.parse(rule.skus) as string[]).join(', ')} maxLength={10000} /></label>
      <label>Minimum eligible spend (₹)<input type="number" name="minimum" min={0} step=".01" defaultValue={(rule?.minimum ?? 0) / 100} /></label>
      <label>Minimum eligible quantity<input type="number" name="quantity" min={0} defaultValue={rule?.quantity ?? 0} /></label>
      <label>Maximum savings (₹, 0 for no cap)<input type="number" name="cap" min={0} step=".01" defaultValue={(rule?.cap ?? 0) / 100} /></label>
      <label>Total uses (0 for unlimited)<input type="number" name="usageLimit" min={0} defaultValue={rule?.usage_limit ?? 0} /></label>
      <label>Coupon uses per email (0 for unlimited)<input type="number" name="customerLimit" min={0} defaultValue={rule?.customer_limit ?? 0} /></label>
      <label>Starts (India time)<input type="datetime-local" name="starts" defaultValue={indiaDate(rule?.starts)} /></label>
      <label>Ends (India time)<input type="datetime-local" name="ends" defaultValue={indiaDate(rule?.ends)} /></label>
    </div>
    <label className="checkbox"><input type="checkbox" name="enabled" defaultChecked={Boolean(rule?.enabled)} /> Enable this offer</label>
    <label className="checkbox"><input type="checkbox" name="published" defaultChecked={Boolean(rule?.published)} /> Show on the storefront Offers page</label>
    <button className="button">{rule ? 'Save changes' : 'Create promotion'}</button>
  </form>;
}

export default async function Promotions() {
  const rules = await db().prepare(`SELECT promotions.*,
    (SELECT COUNT(*) FROM checkout_promotions cp JOIN checkout c ON c.id=cp.checkout_id
      WHERE cp.promotion_id=promotions.id AND c.order_id IS NOT NULL) AS redeemed,
    (SELECT COUNT(*) FROM checkout_promotions cp JOIN checkout c ON c.id=cp.checkout_id
      WHERE cp.promotion_id=promotions.id AND c.order_id IS NULL) AS reserved
    FROM promotions ORDER BY archived, title`).all<Promotion & { redeemed: number; reserved: number }>();
  const now = Date.now();
  return <>
    <details className="commerce-panel"><summary>Create a coupon or offer</summary><Editor /></details>
    {!rules.length && <p>No promotions yet.</p>}
    {rules.map(rule => {
      const status = rule.archived ? 'Archived' : !rule.enabled ? 'Paused' :
        rule.ends && rule.ends <= now ? 'Ended' : rule.starts && rule.starts > now ? 'Scheduled' :
        rule.usage_limit && rule.redeemed + rule.reserved >= rule.usage_limit ? 'Limit reached' : 'Active';
      const amount = rule.kind === 'shipping' ? 'Shipping discount' :
        rule.kind === 'percent' ? `${rule.value / 100}% off` : `${rupees(rule.value)} off`;
      return <details key={rule.id} className="commerce-panel">
        <summary><strong>{rule.title}</strong> · {rule.code ?? 'Automatic'} · {amount} · {status} · {rule.redeemed} used{rule.reserved > 0 && ` · ${rule.reserved} reserved`}</summary>
        {rule.archived ? <p>{rule.description}</p> : <>
          <Editor rule={rule} />
          <form action={archivePromotion.bind(null, rule.id)}><button type="submit" className="text-link dark">Archive offer</button></form>
        </>}
      </details>;
    })}
  </>;
}
