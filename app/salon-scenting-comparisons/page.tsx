import HotelContentHub from '@/components/HotelContentHub';
import {salonComparisonPages,salonComparisonClusters} from '@/lib/salon-comparisons';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Salon Scenting Comparisons: Equipment, Fragrance & Costs','Compare 50 salon scenting decisions with practical tables, HUME equipment and questions about zones, controls, fragrance and recurring costs.','/salon-scenting-comparisons');
export default function Page(){return <HotelContentHub title="Salon scenting comparisons" category="Salons" solutionPath="/selector" image="receptions-app.jpg" description="Compare equipment, fragrances and services against your salon layout, client preferences and written costs. Explore 50 practical comparisons with suitable HUME starting points." path="/salon-scenting-comparisons" pages={salonComparisonPages} clusters={salonComparisonClusters}/>;}
