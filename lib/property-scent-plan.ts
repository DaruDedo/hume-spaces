import { products, scents } from './content';
import { fragranceSlug } from './fragrances';
import { fragranceAudiences } from './fragrance-audiences';
import { policyNotes } from './fragrance-finder';
import { oilWeights } from './commerce/oil-sizes';

const featuredProperties = [
  { label: 'Hotel', audienceId: 1 },
  { label: 'Gym', audienceId: 2 },
  { label: 'Office', audienceId: 13 },
  { label: 'Retail', audienceId: 23 },
  { label: 'Spa', audienceId: 5 },
  { label: 'Resort', audienceId: 1 },
  { label: 'Dental clinic', audienceId: 18 },
];

export const propertyTypes = [
  ...featuredProperties,
  ...fragranceAudiences.filter(audience => !featuredProperties.some(property => property.audienceId === audience.id))
    .map(audience => ({ label: audience.name, audienceId: audience.id })),
];

const compact = 'hume-commercial-scent-machine-pro';
const large = '800ml-commercial-diffuser';
const tower = 'hume-pro-commercial-tower';
const openSpaces = [1, 5, 14, 23];
export const maxPlanningArea = 5000;

export function propertyScentPlan(audienceId: number, area: number, hours: number, days: number) {
  const audience = fragranceAudiences.find(entry => entry.id === audienceId);
  if (!audience || !Number.isFinite(area) || area < 1 || area > maxPlanningArea ||
    !Number.isFinite(hours) || hours <= 0 || hours > 24 || !Number.isInteger(days) || days < 1 || days > 31) return null;

  const note = policyNotes[audience.policy];
  const scentIds = audienceId === 18 ? ['Cherry Blossom', 'Cotton'] : audience.ids;
  const fragrances = scentIds.map(id => scents.find(scent => scent.id === id))
    .filter(scent => scent !== undefined).slice(0, 3);
  if (!fragrances.length) return { note, plan: null };

  const useTower = area > 1000 && area <= 1500 && openSpaces.includes(audienceId);
  const useLarge = area > 1500 && audience.policy !== 'review';
  const largeCount = useLarge ? Math.max(1, Math.floor(area / 2000)) : 0;
  const remainingArea = Math.max(0, area - largeCount * 2000);
  const compactCount = useTower ? 0
    : largeCount === 1 && area >= 2500 && area <= 3000 ? 2
    : Math.ceil(remainingArea / 1000);
  const machines = [
    { sku: tower, quantity: Number(useTower) },
    { sku: large, quantity: largeCount },
    { sku: compact, quantity: compactCount },
  ].flatMap(({ sku, quantity }) => {
    const model = products.find(product => product.slug === sku);
    return quantity && model ? [{ sku, quantity, model }] : [];
  });

  // The baseline assumes eight hours per day and 26 days per month at low output.
  const baseline = 250 * compactCount + 750 * largeCount + 400 * Number(useTower);
  const monthly = baseline * hours * days / (8 * 26);
  const high = Math.ceil(monthly / 25) * 25;
  const low = Math.max(1, Math.floor(monthly * 0.8 / 25) * 25);
  const fullPacks = Math.floor(high / 1000);
  const remainder = high % 1000;
  const topUp = oilWeights.find(weight => weight >= remainder);
  const packs = [
    { grams: 1000, quantity: fullPacks + Number(remainder > 0 && topUp === 1000) },
    ...(remainder && topUp && topUp < 1000 ? [{ grams: topUp, quantity: 1 }] : []),
  ].filter(pack => pack.quantity > 0);

  return { note, plan: { machines, fragrances, low, high, packs } };
}

export function propertyOilSku(fragranceId: string, grams: number) {
  return 'oil-' + fragranceSlug(fragranceId) + '-' + grams + 'g';
}
