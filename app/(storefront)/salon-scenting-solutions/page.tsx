import HotelContentHub from '@/components/HotelContentHub';
import {salonCommercialPages,salonCommercialClusters} from '@/lib/salon-commercial';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Salon Scenting Solutions & Equipment Enquiries','Explore 50 salon enquiries for commercial diffusers, approved fragrance supply, HVAC and zone-specific quotations from HUME Spaces.','/salon-scenting-solutions');
export default function Page(){return <HotelContentHub title="Salon scenting solutions" category="Salons" solutionPath="/selector" image="receptions-app.jpg" description="Find equipment and fragrance options for your salon or hair studio. Explore 50 enquiry pages, compare catalog prices and send your city, zone size and appointment brief." path="/salon-scenting-solutions" pages={salonCommercialPages} clusters={salonCommercialClusters}/>;}
