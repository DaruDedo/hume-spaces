import HotelContentHub from '@/components/HotelContentHub';
import {spaGuides,spaClusters} from '@/lib/spa-guides';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Spa & Med-Spa Scenting Education: Zones, Fragrance & Equipment','50 luxury spa and med-spa guides on guest preferences, signature briefs, zoning, environmental limits and optional HUME equipment.','/spa-scenting-guides');
export default function Page(){return <HotelContentHub title="Spa & med-spa scenting guides" category="Spas & med-spas" solutionPath="/industries/spas" image="receptions-app.jpg" description="Explore 50 guides for luxury spas and med-spas. Plan optional ambience around guest preferences, treatment products and approved zones, with clinical and environmental exclusions clearly defined." path="/spa-scenting-guides" pages={spaGuides} clusters={spaClusters}/>;}
