import HotelContentHub from '@/components/HotelContentHub';
import {studioTechnologyPages,studioTechnologyClusters} from '@/lib/studio-technology';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Pilates & Yoga Diffuser Technology: Machines, Coverage & Controls','50 boutique fitness equipment guides covering diffusion, placement, controls, coverage calculation, oil consumption, HVAC and maintenance.','/studio-diffuser-technology');
export default function Page(){return <HotelContentHub title="Studio diffuser technology" category="Boutique fitness studios" solutionPath="/industries/gyms" image="gyms-app.png" description="Compare machines and technology for permitted Pilates, yoga and boutique fitness zones. Explore 50 guides on actual specifications, area measurement, airflow, oil use and equipment care." path="/studio-diffuser-technology" pages={studioTechnologyPages} clusters={studioTechnologyClusters}/>;}
