import HotelContentHub from '@/components/HotelContentHub';
import {studioFragrancePages,studioFragranceClusters} from '@/lib/studio-fragrances';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Pilates, Yoga & Barre Fragrance Ideas: Notes & Signature Scents','50 boutique studio fragrance guides covering permitted zones, complete HUME concepts, note availability, interior briefs and signature identity.','/studio-fragrance-ideas');
export default function Page(){return <HotelContentHub title="Studio fragrance ideas" category="Boutique fitness studios" solutionPath="/industries/gyms" image="gyms-app.png" description="Explore 50 fragrance guides for Pilates, yoga, barre and boutique fitness studios. Compare complete HUME concepts for permitted zones, with practice-room policy and unconfirmed notes clearly explained." path="/studio-fragrance-ideas" pages={studioFragrancePages} clusters={studioFragranceClusters}/>;}
