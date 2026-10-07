import HotelContentHub from '@/components/HotelContentHub';
import {gymTechnologyPages,gymTechnologyClusters} from '@/lib/gym-technology';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Gym Diffuser Technology & Machine Selection','50 gym technology guides covering commercial diffusers, coverage measurement, app controls, HVAC integration and maintenance.','/gym-diffuser-technology');
export default function Page(){return <HotelContentHub title="Gym diffuser technology" category="Gyms & fitness" solutionPath="/industries/gyms" image="gyms-app.png" description="Compare machines and controls, measure your gym zones and understand approved installation and maintenance. Explore 50 technology guides with relevant HUME equipment." path="/gym-diffuser-technology" pages={gymTechnologyPages} clusters={gymTechnologyClusters}/>;}
