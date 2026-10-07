import HotelContentHub from '@/components/HotelContentHub';
import {clinicProblemPages,clinicProblemClusters} from '@/lib/clinic-problems';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Clinic Reception Problems: Freshness, Fragrance & Patient Feedback','50 practical clinic guides on source odours, moisture, ventilation, fragrance distribution, clinical exclusions and patient concerns.','/clinic-scenting-problems');
export default function Page(){return <HotelContentHub title="Clinic reception problems" category="Clinics" solutionPath="/selector" image="receptions-app.jpg" description="Start with source review and practice policy. Explore 50 guides for reception freshness, cleaning aromas, fragrance distribution and patient concerns; optional equipment is limited to an approved non-clinical zone." path="/clinic-scenting-problems" pages={clinicProblemPages} clusters={clinicProblemClusters}/>;}
