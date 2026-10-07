import HotelContentHub from '@/components/HotelContentHub';
import {hotelComparisonPages,hotelComparisonClusters} from '@/lib/hotel-comparisons';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Hotel scenting comparisons','Compare 50 hotel scenting decisions: diffusion formats, controls, fragrance directions, ownership and recurring costs.','/hotel-scenting-comparisons');
export default function Page(){return <HotelContentHub title="Hotel scenting comparisons" description="Compare 50 hotel scenting decisions: diffusion formats, controls, fragrance directions, ownership and recurring costs." path="/hotel-scenting-comparisons" pages={hotelComparisonPages} clusters={hotelComparisonClusters}/>;}
