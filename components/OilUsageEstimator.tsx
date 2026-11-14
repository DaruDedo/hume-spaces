'use client';
import RowSelect from '@/components/RowSelect';

import Image from 'next/image';
import Link from '@/components/PageProgress';
import { useState, type FormEvent } from 'react';
import styles from './OilUsageEstimator.module.css';
import CommerceButtons from './CommerceButtons';

const commercial400 = { name: "400 mL Commercial Diffuser", href: "/equipment/hume-commercial-scent-machine-pro", image: "commercial-scent-machine-pro.jpg" };
const commercial800 = { name: "800 mL Commercial Diffuser", href: "/equipment/800ml-commercial-diffuser", image: "800ml-commercial-diffuser.png" };
const tower = { name: "Tower Commercial Diffuser", href: "/equipment/hume-pro-commercial-tower", image: "commercial-diffuser.png" };
const personal = { name: "Car & Room Diffuser", href: "/equipment/car-room-diffuser", image: "car-room-diffuser.png" };
const reed = { name: "Mini Reed Diffuser", href: "/equipment/hume-mini-reed-diffuser-50ml", image: "decorative-diffuser.png" };
const hvac = { name: "HVAC Scenting System", href: "/equipment/hume-hvac-scenting-system", image: "hvac-diffuser-v2.png" };

const reedCoverage = 120;
const towerCoverage = 1500;
const hvacCoverage = 5000;
type Space = 'commercial' | 'personal' | 'bathroom';

type Setup = { count: number | string; model: typeof commercial400 }[];

const recommendations: { maxArea: number; oil?: { low: number; high: number }; setups: Setup[] }[] = [
  { maxArea: 500, oil: { low: 200, high: 250 }, setups: [[{ count: 1, model: commercial400 }]] },
  { maxArea: 1000, oil: { low: 400, high: 500 }, setups: [[{ count: 2, model: commercial400 }]] },
  { maxArea: 2000, oil: { low: 700, high: 800 }, setups: [[{ count: 1, model: commercial800 }], [{ count: 3, model: commercial400 }]] },
  {
    maxArea: 3000,
    setups: [
      [{ count: 1, model: commercial800 }, { count: 2, model: commercial400 }],
      [{ count: '4–5', model: commercial400 }],
    ],
  },
];

export default function OilUsageEstimator({ bottleMl, oilSku, initialSpace = 'commercial' }: { bottleMl?: number; oilSku?: string; initialSpace?: Space }) {
  const [expanded, setExpanded] = useState(false);
  const [space, setSpace] = useState<Space>(initialSpace);
  const [area, setArea] = useState<number | null>(null);
  const recommendation = area !== null && space === 'commercial'
    ? recommendations.find(tier => area <= tier.maxArea)
    : undefined;

  let setups = recommendation?.setups ?? [];
  const oil = recommendation?.oil;
  let guidance = '';
  if (area !== null) {
    if (space === 'personal') {
      setups = [[{ count: 1, model: personal }]];
      guidance = 'For a car, office cabin or small room. Confirm the approved refill and expected refill interval for your setup.';
    } else if (space === 'bathroom' && area <= reedCoverage) {
      setups = [[{ count: 1, model: reed }]];
      guidance = 'A 50 mL reed diffuser is a starting option for a small bathroom. Use the approved reed refill and replace it as needed.';
    } else if (recommendation && area <= towerCoverage) {
      setups = [...setups, [{ count: 1, model: tower }]];
      guidance = 'Consider the tower for an open lobby, boutique or showroom. Confirm its monthly oil use separately.';
    } else if (space === 'commercial' && !recommendation && area <= hvacCoverage) {
      setups = [[{ count: 1, model: hvac }]];
      guidance = 'Consider HVAC scenting if your space has compatible central ducts. Share your layout for a tailored setup and oil estimate.';
    }
  }

  const needsConsultation = area !== null && (setups.length === 0 || space === 'commercial' && !oil);

  function estimate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setArea(space === 'personal' ? 0 : Number(new FormData(event.currentTarget).get('area')));
  }

  return (
    <section className={styles.card} aria-labelledby="oil-estimator-title">
      <div className={styles.art}>
        <Image src="/images/spaces/oil-usage-estimator.webp" alt="" fill sizes="(max-width: 640px) 95vw, 760px" />
        <div className={styles.intro}>
          <div>
            <p className="eyebrow">REFILL PLANNER</p>
            <h2 id="oil-estimator-title">How much fragrance oil will I need each month?</h2>
            <p>Find a diffuser for your space and get a monthly oil range for commercial setups.</p>
          </div>
          <button
            className="button"
            type="button"
            aria-expanded={expanded}
            aria-controls="oil-estimator-form"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Hide planner' : 'Estimate my usage'}
          </button>
        </div>
      </div>

      <form id="oil-estimator-form" hidden={!expanded} className={styles.form} onSubmit={estimate} onChange={() => setArea(null)}>
        <label className={styles.field}>
          Type of space
          <RowSelect value={space} onValueChange={value => { setSpace(value as Space); setArea(null); }}>
            <option value="commercial">Commercial space</option>
            <option value="personal">Car, cabin or small room</option>
            <option value="bathroom">Bathroom or powder room</option>
          </RowSelect>
        </label>
        {space !== 'personal' && (
          <label className={styles.field}>
            Area to scent (sq ft)
            <input name="area" type="number" min="1" step="any" placeholder={space === 'bathroom' ? 'e.g. 60' : 'e.g. 500'} required />
          </label>
        )}
        <button className="button" type="submit">Show my recommendation</button>

        <div role="status" aria-atomic="true">
          {area !== null && (
            <div className={styles.result}>
              {oil ? (
                <>
                  <strong>About {oil.low}–{oil.high} mL per month</strong>
                  <p>Estimated oil budget for the 400 mL and 800 mL diffuser options shown below.</p>
                  {bottleMl && (
                    <>
                      <p>Plan for up to {Math.ceil(oil.high / bottleMl)} × {bottleMl} mL bottles per month.</p>
                      {oilSku && <CommerceButtons items={[{ sku: oilSku, quantity: Math.ceil(oil.high / bottleMl) }]} label="Add this oil amount to cart" buyNow={false} />}
                    </>
                  )}
                </>
              ) : (
                <strong>{setups.length ? 'Suggested diffuser setup' : 'Plan your diffuser setup by zone'}</strong>
              )}
              {setups.length > 0 && <div className={styles.machineOptions}>
                {setups.map((setup, index) => (
                  <div key={setup[0].model.href}>
                    {index > 0 && <p className={styles.alternative}>or</p>}
                    {setup.map(({ count, model }, modelIndex) => (
                      <div key={model.href}>
                        {modelIndex > 0 && <p className={styles.alternative}>+</p>}
                        <Link href={model.href} className={styles.machineOption}>
                          <span className={styles.machineThumbnail}>
                            <Image src={`/images/spaces/${model.image}`} alt="" fill sizes="62px" />
                          </span>
                          <span>{count} × {model.name}</span>
                        </Link>
                      </div>
                    ))}
                    {recommendation && setup.every(item => typeof item.count === 'number') &&
                      <CommerceButtons items={setup.map(({ model, count }) => ({ sku: model.href.split('/').at(-1)!, quantity: Number(count) }))} label="Add this setup to cart" buyNow={false} />}
                  </div>
                ))}
              </div>}
              {guidance && <p>{guidance}</p>}
              {recommendation && <p>Actual oil usage depends on how many hours per day and days per month you run your diffuser.</p>}
              {needsConsultation && (
                <>
                  {!guidance && <p>Share your layout for a tailored oil estimate.</p>}
                  <Link className="text-link dark" href="/consultation">Discuss your space →</Link>
                </>
              )}
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
