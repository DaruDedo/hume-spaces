import HotelContentHub from '@/components/HotelContentHub';
import {clinicFragrancePages,clinicFragranceClusters} from '@/lib/clinic-fragrances';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Clinic Fragrance Ideas: Understated Ambience & Policy','50 clinic fragrance guides covering optional reception concepts, notes, fragrance-free choices and signature briefs without medical claims.','/clinic-fragrance-ideas');
export default function Page(){return <HotelContentHub title="Clinic fragrance ideas" category="Clinics" solutionPath="/selector" image="receptions-app.jpg" description="Explore understated hospitality directions and fragrance-free choices across 50 clinic guides. Practice policy and patient requirements come before notes or equipment; no medical benefit is claimed." path="/clinic-fragrance-ideas" pages={clinicFragrancePages} clusters={clinicFragranceClusters}/>;}
