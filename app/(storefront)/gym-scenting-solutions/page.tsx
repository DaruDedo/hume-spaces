import HotelContentHub from '@/components/HotelContentHub';
import {gymCommercialPages,gymCommercialClusters} from '@/lib/gym-commercial';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Gym Scenting Solutions & Equipment Enquiries','Explore 50 gym scenting enquiries for commercial machines, fragrance supply, smart controls, HVAC and zone planning. Ask HUME Spaces for a scoped quote.','/gym-scenting-solutions');
export default function Page(){return <HotelContentHub title="Gym scenting solutions" category="Gyms & fitness" solutionPath="/industries/gyms" image="gyms-app.png" description="Find equipment and fragrance options for your gym or studio. Explore 50 enquiry guides, compare catalog prices and send your city, zone size and operating brief to HUME Spaces." path="/gym-scenting-solutions" pages={gymCommercialPages} clusters={gymCommercialClusters}/>;}
