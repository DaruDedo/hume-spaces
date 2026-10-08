import HotelContentHub from '@/components/HotelContentHub';
import {spaProblemPages,spaProblemClusters} from '@/lib/spa-problems';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Spa Freshness & Scent Problems: Practical Venue Guides','50 spa guides covering dampness, linen, cleaning aromas, treatment-oil overlap, fragrance distribution and guest concerns.','/spa-scenting-problems');
export default function Page(){return <HotelContentHub title="Spa freshness & scent problems" category="Spas & med-spas" solutionPath="/industries/spas" image="receptions-app.jpg" description="Start with the actual source and venue policy. Explore 50 practical spa guides on freshness, textiles, product overlap, fragrance distribution and guest preferences, with optional equipment for approved zones." path="/spa-scenting-problems" pages={spaProblemPages} clusters={spaProblemClusters}/>;}
