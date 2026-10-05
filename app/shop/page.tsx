import Link from 'next/link';
import {PageIntro} from '@/components/Shell';
import EquipmentCatalog from '@/components/EquipmentCatalog';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Shop','Browse scent machines and reed diffusers. Request prices and availability.','/shop');
export default function Shop(){return <><PageIntro eyebrow="SHOP" title="Choose your product" description="Browse the products below. Prices and availability are confirmed by quotation."/><section className="wrap section-bottom"><EquipmentCatalog/><p className="footnote">Specifications are indicative; suitability depends on your layout and airflow.</p><div className="simple-help"><h2>Looking for fragrance oils?</h2><p>Explore six fragrance profiles for your space.</p><Link className="button outline" href="/fragrance-oils">Browse fragrances <span>→</span></Link></div></section></>}
