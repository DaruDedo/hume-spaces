import HotelContentHub from '@/components/HotelContentHub';
import {spaCommercialPages,spaCommercialClusters} from '@/lib/spa-commercial';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Spa Scenting Solutions India: Equipment & Fragrance Enquiries','50 luxury spa and med-spa enquiry pages with HUME equipment prices, approved-zone planning and quotation questions.','/spa-scenting-solutions');
export default function Page(){return <HotelContentHub title="Spa scenting enquiries" category="Spas & med-spas" solutionPath="/industries/spas" image="receptions-app.jpg" description="Explore 50 equipment and fragrance enquiries for luxury spas, day spas, retreats and approved med-spa hospitality zones. Review guest preferences, environmental limits and written quote inclusions." path="/spa-scenting-solutions" pages={spaCommercialPages} clusters={spaCommercialClusters}/>;}
