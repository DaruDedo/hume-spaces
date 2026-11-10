import HotelContentHub from '@/components/HotelContentHub';
import {spaTechnologyPages,spaTechnologyClusters} from '@/lib/spa-technology';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Spa Diffuser Technology: Machines, Coverage & Oil Use','50 spa equipment guides covering HUME models, controls, zone measurement, oil consumption, maintenance and environmental limits.','/spa-diffuser-technology');
export default function Page(){return <HotelContentHub title="Spa diffuser technology" category="Spas & med-spas" solutionPath="/industries/spas" image="receptions-app.jpg" description="Compare machines, measure approved zones and understand oil use across 50 technology guides. Review venue permissions, guest preferences and hot, wet or clinical exclusions before installation." path="/spa-diffuser-technology" pages={spaTechnologyPages} clusters={spaTechnologyClusters}/>;}
