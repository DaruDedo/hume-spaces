import HotelContentHub from '@/components/HotelContentHub';
import {salonGuides,salonClusters} from '@/lib/salon-guides';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Salon Scenting Guides: Branding, Zones & Equipment','50 practical salon education guides covering fragrance identity, treatment-zone review, ventilation, equipment, maintenance and chain standards.','/salon-scenting-guides');
export default function Page(){return <HotelContentHub title="Salon scenting guides" category="Salons" solutionPath="/selector" image="receptions-app.jpg" description="Explore 50 guides for salon owners: plan optional fragrance by client zone, compare equipment and maintain ventilation, product controls and client choice." path="/salon-scenting-guides" pages={salonGuides} clusters={salonClusters}/>;}
