'use client';
import RowSelect from '@/components/RowSelect';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, type FormEvent } from 'react';
import { recordPropertyType, startCheckout } from '@/app/commerce-actions';
import { currentStorefrontVisit } from '@/lib/commerce/activity-session';
import { propertySearchTerm } from '@/lib/property-search-term';
import { oilWeightLabel } from '@/lib/commerce/oil-sizes';
import { fragranceSlug } from '@/lib/fragrances';
import { maxPlanningArea, propertyOilSku, propertyScentPlan, propertyTypes } from '@/lib/property-scent-plan';
import styles from './PropertyScentPlanner.module.css';
import estimatorStyles from './OilUsageEstimator.module.css';

const savedPropertyKey = 'hume-saved-property-types';

export default function PropertyScentPlanner() {
  const [expanded, setExpanded] = useState(false);
  const [propertyIndex, setPropertyIndex] = useState('');
  const [savedProperties, setSavedProperties] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<ReturnType<typeof propertyScentPlan>>(null);
  const [fragranceIndex, setFragranceIndex] = useState(0);
  const [error, setError] = useState('');
  const [buying, setBuying] = useState(false);
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(savedPropertyKey) ?? '[]');
      if (Array.isArray(saved)) setSavedProperties(saved.map(propertySearchTerm).filter((term): term is string => term !== null).slice(0, 20));
    } catch {}
  }, []);
  const choices = [
    ...propertyTypes.map(({ label }, index) => ({ label, value: String(index) })),
    ...savedProperties.map(label => ({ label, value: 'custom:' + label })),
  ].sort((a, b) => a.label.localeCompare(b.label, 'en', { sensitivity: 'base' }));
  const selectedProperty = choices.find(choice => choice.value === propertyIndex);

  function selectProperty(value: string) {
    setPropertyIndex(value);
    setRecommendation(null);
    setError('');
  }

  function addProperty(input: string) {
    const term = propertySearchTerm(input);
    if (!term || choices.some(choice => choice.label.toLowerCase() === term.toLowerCase())) return;
    const next = [term, ...savedProperties].slice(0, 20);
    setSavedProperties(next);
    try { localStorage.setItem(savedPropertyKey, JSON.stringify(next)); } catch {}
    selectProperty('custom:' + term);
    void recordPropertyType(term).catch(() => {});
  }
  const plan = recommendation?.plan;
  const fragrance = plan?.fragrances[fragranceIndex];
  const products = plan && fragrance ? [
    ...plan.machines.map(({ sku, model, quantity }) => ({
      key: sku, href: '/equipment/' + sku, name: model.name, image: model.image,
      detail: `Qty ${quantity}`,
    })),
    ...plan.packs.map(({ grams, quantity }) => ({
      key: propertyOilSku(fragrance.id, grams), href: '/fragrance-oils/' + fragranceSlug(fragrance.id),
      name: fragrance.name + ' Fragrance Oil', image: fragrance.image,
      detail: `${oilWeightLabel(grams)} pack · Qty ${quantity}`,
    })),
  ] : [];

  function estimate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    if (propertyIndex.startsWith('custom:')) {
      setRecommendation({ note: 'Share your layout and schedule for a tailored fragrance and diffuser recommendation.', plan: null });
      return;
    }
    const property = propertyTypes[Number.parseInt(propertyIndex, 10)];
    if (!property) return;
    const result = propertyScentPlan(property.audienceId, Number(fields.get('area')), Number(fields.get('hours')), Number(fields.get('days')));
    setFragranceIndex(0);
    setRecommendation(result);
    if (result?.plan) window.dispatchEvent(new Event('hume-planner-result'));
    setError(result ? '' : 'Check the area, hours and days of use.');
  }

  async function buyPlan() {
    if (!plan || !fragrance || buying) return;
    setBuying(true);
    setError('');
    const items = [
      ...plan.machines.map(({ sku, quantity }) => ({ sku, quantity })),
      ...plan.packs.map(({ grams, quantity }) => ({ sku: propertyOilSku(fragrance.id, grams), quantity })),
    ];
    try {
      const result = await startCheckout(items, 'planner', currentStorefrontVisit());
      if (result.url) {
        window.location.assign(result.url);
        return;
      }
      setError(result.error ?? 'Unable to start checkout. Please try again.');
    } catch {
      setError('Unable to start checkout. Please try again.');
    }
    setBuying(false);
  }

  return (
    <div className="wrap simple-section">
      <section className={styles.planner} aria-labelledby="property-planner-title">
        <h2 id="property-planner-title">Plan a Fragrance Solution for Your Property</h2>
        <p className={styles.description}>Enter your area and schedule to find a diffuser setup, a fragrance and an estimated monthly oil amount.</p>
        <button className="button" type="button" aria-expanded={expanded} aria-controls="property-plan-fields"
          disabled={buying} onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Hide planner' : 'Plan my space'}
        </button>
        <div id="property-plan-fields" hidden={!expanded}>
          <form className={styles.form} onSubmit={estimate} onChange={() => { setRecommendation(null); setError(''); }}>
            <fieldset disabled={buying}>
              <label className={estimatorStyles.field}>
                Property type
                <RowSelect required value={propertyIndex} onValueChange={selectProperty}
                  searchPlaceholder="Search property types" onAddOption={addProperty}>
                  <option value="">Choose a property type</option>
                  {choices.map(({ label, value }) => <option key={value} value={value}>{label}</option>)}
                </RowSelect>
              </label>
              <label className={estimatorStyles.field}>
                Area to scent (sq ft)
                <input name="area" type="number" min="1" max={maxPlanningArea} step="any" placeholder="e.g. 1,300" required />
              </label>
              <label className={estimatorStyles.field}>
                Hours per day
                <input name="hours" type="number" min="0.5" max="24" step="0.5" defaultValue="8" required />
              </label>
              <label className={estimatorStyles.field}>
                Days per month
                <input name="days" type="number" min="1" max="31" defaultValue="26" required />
              </label>
            </fieldset>
            <button className="button" type="submit" disabled={buying}>Show my plan</button>
          </form>
          <p className={styles.hint}>Planning more than 5,000 sq ft or several separate zones? <Link href="/consultation">Discuss your layout</Link>.</p>
          {recommendation && (
            <div className={estimatorStyles.result}>
              <h3 aria-live="polite">{selectedProperty?.label} scent plan</h3>
              {recommendation.note && <p>{recommendation.note}</p>}
              {plan && fragrance ? (
                <>
                  <label className={estimatorStyles.field}>
                    Suggested fragrance
                    <RowSelect value={fragranceIndex} disabled={buying} onValueChange={value => {
                      setFragranceIndex(Number(value));
                      setError('');
                    }}>
                      {plan.fragrances.map((scent, index) => <option key={scent.id} value={index}>{scent.name}</option>)}
                    </RowSelect>
                  </label>
                  <p><b>About {plan.low}–{plan.high} mL of oil per month</b></p>
                  <ul className={styles.products} aria-label="Products included in this plan">
                    {products.map((product, index) => (
                      <li key={product.key}>
                        {index > 0 && <span className={styles.productConnector} aria-hidden="true">
                          <span>+</span>
                        </span>}
                        <Link className={styles.productRow} href={product.href}>
                          <Image src={'/images/spaces/' + product.image} alt="" width={64} height={64} />
                          <span>
                            <b>{product.name}</b>
                            <span className={styles.productDetail}>{product.detail}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <button className="button" type="button" disabled={buying} onClick={buyPlan}>
                    {buying ? 'Opening checkout…' : 'Buy Whole Plan Now'}
                  </button>
                </>
              ) : (
                <Link className="button outline" href="/consultation">Discuss your property</Link>
              )}
            </div>
          )}
          {error && <p role="alert">{error}</p>}
        </div>
      </section>
    </div>
  );
}
