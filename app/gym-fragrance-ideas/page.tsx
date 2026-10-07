import HotelContentHub from '@/components/HotelContentHub';
import {gymFragrancePages,gymFragranceClusters} from '@/lib/gym-fragrances';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Gym Fragrance Ideas: Notes, Zones & Signature Briefs','Explore 50 gym fragrance guides with HUME concepts, specific notes, member-preference planning and enquiries for unconfirmed directions.','/gym-fragrance-ideas');
export default function Page(){return <HotelContentHub title="Gym fragrance ideas" category="Gyms & fitness" solutionPath="/industries/gyms" image="gyms-app.png" description="Explore 50 fragrance guides by gym identity, zone and note. Compare existing HUME concepts or send a brief for an unconfirmed direction, with member preferences and approved equipment pairing in mind." path="/gym-fragrance-ideas" pages={gymFragrancePages} clusters={gymFragranceClusters}/>;}
