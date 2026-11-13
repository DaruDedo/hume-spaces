import {brandDescription} from '@/lib/brand';
import SpaceChoices, {spaceIcons} from './SpaceChoices';
import FragranceCards from './FragranceCards';
import WhatsAppButton from '@/components/WhatsAppButton';
import CustomerReviews from './CustomerReviews';
import HomeFaq from './HomeFaq';
import HomeHero from './HomeHero';
import HomeServiceAreas from './HomeServiceAreas';
import HomeSignatureFragrance from './HomeSignatureFragrance';
import Link from '@/components/PageProgress';
import {industries,scents} from '@/lib/content';
import EquipmentCatalog from './EquipmentCatalog';
import OilUsageEstimator from './OilUsageEstimator';
import PropertyScentPlanner from './PropertyScentPlanner';
import SpacesServedGrid from './SpacesServedGrid';
export function FragranceExplorer({standalone=false,limit}:{standalone?:boolean;limit?:number}){return <FragranceCards limit={limit}/>;}
const spacesServed = [
  {count: 115, label: 'Doctor clinics', icon: spaceIcons.clinic},
  {count: 65, label: 'Hotels', icon: spaceIcons.hotel},
  {count: 135, label: 'Restaurants', icon: 'M4 3v5a3 3 0 0 0 6 0V3M7 3v18m13-18c-3 2-4 5-4 9h4m0-9v18'},
  {count: 120, label: 'Corporate offices', icon: spaceIcons.office},
  {count: 15, label: 'Car showrooms', icon: 'm5 10 2-5h10l2 5M3 17v-4a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v4H3Zm2 0v3m14-3v3M6.5 13.5h1m9 0h1'},
  {count: 75, label: 'Salons', icon: spaceIcons.salon},
  {count: 45, label: 'Gyms', icon: spaceIcons.gym},
  {count: 25, label: 'Real estate projects', icon: 'm3 11 9-8 9 8M5 10v10h14V10M10 20v-6h4v6'},
  {count: 45, label: 'Pilates / yoga studios', icon: spaceIcons.lotus},
  {count: 5, label: 'Co-working spaces', icon: 'M9 7a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm10 0a2 2 0 1 0-4 0 2 2 0 0 0 4 0ZM3 14a4 4 0 0 1 8 0m2 0a4 4 0 0 1 8 0M3 16h18M5 16v4m14-4v4'},
  {count: 5, label: 'Pet care clinics', icon: 'M7 18c0-1.8 1.7-2.4 2.7-4 .6-1 1.3-1.5 2.3-1.5s1.7.5 2.3 1.5c1 1.6 2.7 2.2 2.7 4 0 1.4-1 2-2 2-1.1 0-1.8-.6-3-.6s-1.9.6-3 .6c-1 0-2-.6-2-2ZM6 10a1.5 1.9 0 1 1-3 0 1.5 1.9 0 1 1 3 0Zm4.5-4a1.5 1.9 0 1 1-3 0 1.5 1.9 0 1 1 3 0Zm6 0a1.5 1.9 0 1 1-3 0 1.5 1.9 0 1 1 3 0ZM21 10a1.5 1.9 0 1 1-3 0 1.5 1.9 0 1 1 3 0Z'},
  {count: 15, label: 'Schools / universities', icon: 'm2 9 10-5 10 5-10 5-10-5Zm4 2v5c3 4 9 4 12 0v-5m4-2v7'},
  {count: 2, label: 'Malls', icon: spaceIcons.mall},
  {count: 12, label: 'Jewelry showrooms', icon: 'M7 4h10l4 5-9 11L3 9l4-5ZM3 9h18m-12 0 3 11 3-11m-6 0 3-5 3 5'},
];

function SpacesServed() {
  return (
    <section className="wrap simple-section home-spaces-served" aria-labelledby="spaces-served-title">
      <h2 id="spaces-served-title">Spaces we’ve served</h2>
      <SpacesServedGrid spaces={spacesServed} />
    </section>
  );
}

export default function HomeExperience(){return <div className="simple-home">
  <HomeHero />
  <section className="wrap simple-section"><div className="section-heading"><div><h2>Choose a product</h2><p>Scent machines and reed diffusers. Find your fit.</p></div></div><EquipmentCatalog showControls={false} sortByPrice cartOnly/><p className="footnote">Specifications are indicative. Confirm suitability, price and availability before ordering.</p><Link className="button outline see-all-products" href="/shop">See all products <span>→</span></Link></section><div className="wrap"><OilUsageEstimator/></div><section className="wrap simple-section home-fragrances" aria-labelledby="home-fragrance-title"><div className="section-heading"><div><h2 id="home-fragrance-title">Choose a fragrance</h2><p>Explore the notes. Enquire about your favourite.</p></div></div><FragranceExplorer limit={10}/><p className="footnote">Pure fragrance oils available in five pack sizes from 50 g to 1 kg.</p><Link className="button outline see-all-fragrances" href="/fragrance-oils">See all fragrances <span>→</span></Link></section><section id="discover" className="wrap simple-section"><h2>Choose your space</h2><SpaceChoices/></section><PropertyScentPlanner />
  <SpacesServed />
  <HomeServiceAreas />
  <CustomerReviews />
  <HomeFaq />
  <section className="wrap simple-section simple-help"><h2>Need help choosing?</h2><p>Tell us about your space to request a quotation.</p><WhatsAppButton label="Help me choose on WhatsApp"/></section>
  <HomeSignatureFragrance />
</div>}








