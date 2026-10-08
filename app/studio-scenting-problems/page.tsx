import HotelContentHub from '@/components/HotelContentHub';
import {studioProblemPages,studioProblemClusters} from '@/lib/studio-problems';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Pilates & Yoga Studio Smell Problems: Practical Guides','50 boutique studio guides for sweat, mats, dampness, ventilation, fragrance intensity, member preferences and optional equipment enquiries.','/studio-scenting-problems');
export default function Page(){return <HotelContentHub title="Studio freshness & scent problems" category="Boutique fitness studios" solutionPath="/industries/gyms" image="gyms-app.png" description="Find practical next steps for Pilates, yoga, barre and boutique studio odours, uneven fragrance and member feedback. Address sources first, then assess any optional ambience for permitted zones." path="/studio-scenting-problems" pages={studioProblemPages} clusters={studioProblemClusters}/>;}
