import HotelContentHub from '@/components/HotelContentHub';
import {salonProblemPages,salonProblemClusters} from '@/lib/salon-problems';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Salon Freshness & Scent Problems','50 practical salon guides on treatment odours, moisture, ventilation, fragrance distribution and client feedback.','/salon-scenting-problems');
export default function Page(){return <HotelContentHub title="Salon freshness & scent problems" category="Salons" solutionPath="/selector" image="receptions-app.jpg" description="Start with the source. Explore 50 practical guides for salon odours, damp conditions, scent distribution and client preferences, with optional HUME equipment for reviewed zones." path="/salon-scenting-problems" pages={salonProblemPages} clusters={salonProblemClusters}/>;}
