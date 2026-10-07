import HotelContentHub from '@/components/HotelContentHub';
import {clinicTechnologyPages,clinicTechnologyClusters} from '@/lib/clinic-technology';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Clinic Diffuser Technology: Reception Equipment & Coverage','50 clinic technology guides covering approved reception zones, HUME machines, controls, area measurement and clinical exclusions.','/clinic-diffuser-technology');
export default function Page(){return <HotelContentHub title="Clinic diffuser technology" category="Clinics" solutionPath="/selector" image="receptions-app.jpg" description="Review reception equipment, supported controls, area measurement and maintenance across 50 guides. Any optional fragrance requires practice approval and verified clinical exclusions." path="/clinic-diffuser-technology" pages={clinicTechnologyPages} clusters={clinicTechnologyClusters}/>;}
