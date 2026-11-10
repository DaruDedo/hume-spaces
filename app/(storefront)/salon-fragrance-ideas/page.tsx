import HotelContentHub from '@/components/HotelContentHub';
import {salonFragrancePages,salonFragranceClusters} from '@/lib/salon-fragrances';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Salon Fragrance Ideas: Notes, Zones & Signature Scents','Explore 50 salon fragrance guides with HUME concepts, client preference checks, note availability and suitable equipment.','/salon-fragrance-ideas');
export default function Page(){return <HotelContentHub title="Salon fragrance ideas" category="Salons" solutionPath="/selector" image="receptions-app.jpg" description="Explore fragrance directions for salon reception, appointments and brand identity. Compare confirmed catalog notes and enquire about new directions across 50 guides." path="/salon-fragrance-ideas" pages={salonFragrancePages} clusters={salonFragranceClusters}/>;}
