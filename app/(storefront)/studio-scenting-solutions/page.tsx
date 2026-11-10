import HotelContentHub from '@/components/HotelContentHub';
import {studioCommercialPages,studioCommercialClusters} from '@/lib/studio-commercial';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Pilates, Yoga & Barre Scenting Solutions India','Compare HUME Spaces machines, fragrance supply, signature briefs and approved-zone enquiries for Pilates, yoga, barre and boutique fitness studios.','/studio-scenting-solutions');
export default function Page(){return <HotelContentHub title="Pilates, yoga & barre scenting solutions" category="Boutique fitness studios" solutionPath="/industries/gyms" image="gyms-app.png" description="Explore 50 commercial studio topics. Compare equipment and fragrance enquiries by discipline, room, area and operating brief, with reception and practice spaces decided separately." path="/studio-scenting-solutions" pages={studioCommercialPages} clusters={studioCommercialClusters}/>;}
