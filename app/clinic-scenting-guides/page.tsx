import HotelContentHub from '@/components/HotelContentHub';
import {clinicGuides,clinicClusters} from '@/lib/clinic-guides';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Clinic Scenting Education: Hospitality Zones & Fragrance Policy','50 dermatology, aesthetic and plastic surgery clinic guides on optional non-clinical hospitality scenting, exclusions, policy and equipment.','/clinic-scenting-guides');
export default function Page(){return <HotelContentHub title="Clinic scenting education" category="Clinics" solutionPath="/selector" image="receptions-app.jpg" description="Explore 50 guides for dermatology, aesthetic and plastic surgery clinics. Start with practice policy and patient needs; any optional fragrance is limited to approved non-clinical hospitality zones." path="/clinic-scenting-guides" pages={clinicGuides} clusters={clinicClusters}/>;}
