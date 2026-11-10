import HotelContentHub from '@/components/HotelContentHub';
import {spaFragrancePages,spaFragranceClusters} from '@/lib/spa-fragrances';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Spa Fragrance Ideas: Notes, Zones & Signature Scents','50 luxury spa and med-spa fragrance guides with HUME concepts, note availability, guest preferences and approved-zone pairing.','/spa-fragrance-ideas');
export default function Page(){return <HotelContentHub title="Spa fragrance ideas" category="Spas & med-spas" solutionPath="/industries/spas" image="receptions-app.jpg" description="Explore fragrance character across 50 spa guides: approved hospitality zones, complete HUME concepts, unconfirmed-note enquiries and signature briefs. Guest preferences and venue policy come before fragrance or equipment." path="/spa-fragrance-ideas" pages={spaFragrancePages} clusters={spaFragranceClusters}/>;}
