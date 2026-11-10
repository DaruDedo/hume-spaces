import HotelContentHub from '@/components/HotelContentHub';
import {salonTechnologyPages,salonTechnologyClusters} from '@/lib/salon-technology';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Salon Diffuser Technology & Machine Selection','50 salon technology guides covering HUME 400ml, 800ml, tower and HVAC formats, controls, area measurement and maintenance.','/salon-diffuser-technology');
export default function Page(){return <HotelContentHub title="Salon diffuser technology" category="Salons" solutionPath="/selector" image="receptions-app.jpg" description="Compare salon machines and controls, measure your zones and understand approved installation and maintenance. Explore 50 technology guides with relevant HUME equipment." path="/salon-diffuser-technology" pages={salonTechnologyPages} clusters={salonTechnologyClusters}/>;}
