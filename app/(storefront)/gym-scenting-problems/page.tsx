import HotelContentHub from '@/components/HotelContentHub';
import {gymProblemPages,gymProblemClusters} from '@/lib/gym-problems';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Gym Freshness & Scent Problems: Practical Guides','50 practical gym problem guides covering unwanted smells, damp, fragrance strength, airflow, member complaints and branch consistency.','/gym-scenting-problems');
export default function Page(){return <HotelContentHub title="Gym freshness & scent problems" category="Gyms & fitness" solutionPath="/industries/gyms" image="gyms-app.png" description="Find practical next steps for 50 gym freshness and fragrance issues. Investigate sources, review maintenance and assess optional ambient scent only where appropriate." path="/gym-scenting-problems" pages={gymProblemPages} clusters={gymProblemClusters}/>;}
