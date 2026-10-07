import HotelContentHub from '@/components/HotelContentHub';
import {gymComparisonPages,gymComparisonClusters} from '@/lib/gym-comparisons';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Gym Scenting Comparisons: Equipment, Fragrance & Costs','Compare 50 gym scenting decisions with practical tables, catalog equipment and questions about coverage, controls, fragrances and total costs.','/gym-scenting-comparisons');
export default function Page(){return <HotelContentHub title="Gym scenting comparisons" category="Gyms & fitness" solutionPath="/industries/gyms" image="gyms-app.png" description="Compare 50 equipment, fragrance and service decisions for your gym. Review each option against the same zone brief, member preferences and written costs." path="/gym-scenting-comparisons" pages={gymComparisonPages} clusters={gymComparisonClusters}/>;}
