import HotelContentHub from '@/components/HotelContentHub';
import {clinicCommercialPages,clinicCommercialClusters} from '@/lib/clinic-commercial';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Clinic Scenting Solutions India: Approved Reception Enquiries','Explore 50 clinic equipment and fragrance enquiry pages for approved non-clinical hospitality zones, with HUME prices and quotation questions.','/clinic-scenting-solutions');
export default function Page(){return <HotelContentHub title="Clinic scenting enquiries" category="Clinics" solutionPath="/selector" image="receptions-app.jpg" description="Explore equipment and fragrance enquiries for dermatology, aesthetic and plastic surgery clinics. Any optional scenting starts with practice approval for a non-clinical hospitality zone." path="/clinic-scenting-solutions" pages={clinicCommercialPages} clusters={clinicCommercialClusters}/>;}
