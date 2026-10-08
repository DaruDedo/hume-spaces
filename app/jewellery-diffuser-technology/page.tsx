import HotelContentHub from '@/components/HotelContentHub';
import {jewelleryTechnologyPages,jewelleryTechnologyClusters} from '@/lib/jewellery-technology';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Jewellery Showroom Diffuser Technology: Coverage, Controls & HVAC','50 jewellery equipment guides on cold-air diffusion, placement, controls, high ceilings, coverage calculation, oil use and HVAC review.','/jewellery-diffuser-technology');
export default function Page(){return <HotelContentHub title="Jewellery diffuser technology" category="Jewellery showrooms" solutionPath="/industries/retail" image="retail-stores-app.jpg" description="Explore 50 machine and technology guides for jewellery stores. Compare confirmed HUME specifications with actual showroom height, partitions, air paths, display-care requirements and service access." path="/jewellery-diffuser-technology" pages={jewelleryTechnologyPages} clusters={jewelleryTechnologyClusters}/>;}
