import HotelContentHub from '@/components/HotelContentHub';
import {automotiveTechnologyPages,automotiveTechnologyClusters} from '@/lib/automotive-technology';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Automotive Showroom Diffuser Technology','50 car showroom equipment guides covering coverage, controls, oil, installation and qualified HVAC selection.','/automotive-diffuser-technology');
export default function Page(){return <HotelContentHub title="Automotive diffuser technology" category="Automotive showrooms" solutionPath="/industries/retail" image="retail-stores-app.jpg" description="Compare machines for car dealership customer zones. Explore coverage planning, supported controls, installation, oil consumption and qualified HVAC options." path="/automotive-diffuser-technology" pages={automotiveTechnologyPages} clusters={automotiveTechnologyClusters}/>;}
