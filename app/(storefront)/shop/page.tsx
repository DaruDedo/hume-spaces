import StoreCatalogue from '@/components/StoreCatalogue';
import Link from '@/components/PageProgress';
import {PageIntro} from '@/components/Shell';

import {metadata} from '@/lib/site';
export const dynamic = 'force-dynamic';
export const generateMetadata=()=>metadata('Shop','Browse scent machines and reed diffusers. Request prices and availability.','/shop');
export default async function Shop(){return <><PageIntro eyebrow="SHOP" title="Shop diffusers and fragrance oils" description="Browse the products below. Shop eligible products online or ask us about a custom setup."/><section className="wrap section-bottom"><div className="commerce-actions"><Link className="button outline" href="/fragrance-oils">Shop fragrance oils</Link></div><h2>Diffusers</h2><StoreCatalogue category="equipment"/><h2>Fragrance oils</h2><StoreCatalogue category="oil"/><p className="footnote">Specifications are indicative; suitability depends on your layout and airflow.</p><div className="simple-help"><h2>Looking for fragrance oils?</h2><p>Browse the full collection of 100 mL fragrance oils.</p><Link className="button outline" href="/fragrance-oils">Browse fragrances <span>→</span></Link></div></section></>}
