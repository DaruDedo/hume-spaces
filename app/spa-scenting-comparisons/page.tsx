import HotelContentHub from '@/components/HotelContentHub';
import {spaComparisonPages,spaComparisonClusters} from '@/lib/spa-comparisons';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Spa Scenting Comparisons: Equipment, Fragrance & Costs','Compare 50 spa format, oil, control, fragrance and service decisions with tables, HUME equipment and venue exclusions.','/spa-scenting-comparisons');
export default function Page(){return <HotelContentHub title="Spa scenting comparisons" category="Spas & med-spas" solutionPath="/industries/spas" image="receptions-app.jpg" description="Compare equipment, liquids, zones and ongoing costs against the same approved spa brief. Explore 50 practical decisions with guest preferences and environmental or clinical exclusions preserved." path="/spa-scenting-comparisons" pages={spaComparisonPages} clusters={spaComparisonClusters}/>;}
