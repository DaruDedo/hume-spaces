import HotelContentHub from '@/components/HotelContentHub';
import {studioComparisonPages,studioComparisonClusters} from '@/lib/studio-comparisons';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Pilates & Yoga Studio Scenting Comparisons','50 boutique fitness comparisons covering machines, oils, fragrance notes, placement, controls, services and costs.','/studio-scenting-comparisons');
export default function Page(){return <HotelContentHub title="Studio scenting comparisons" category="Boutique fitness studios" solutionPath="/industries/gyms" image="gyms-app.png" description="Compare scenting options for Pilates, yoga, barre and boutique fitness studios. Explore 50 decisions with practical tables, confirmed specifications and permitted-zone product enquiries." path="/studio-scenting-comparisons" pages={studioComparisonPages} clusters={studioComparisonClusters}/>;}
