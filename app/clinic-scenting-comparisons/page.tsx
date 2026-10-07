import HotelContentHub from '@/components/HotelContentHub';
import {clinicComparisonPages,clinicComparisonClusters} from '@/lib/clinic-comparisons';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Clinic Scenting Comparisons: Formats, Policy & Costs','Compare 50 clinic fragrance decisions with tables, clinical exclusions, fragrance-free choices and optional HUME equipment.','/clinic-scenting-comparisons');
export default function Page(){return <HotelContentHub title="Clinic scenting comparisons" category="Clinics" solutionPath="/selector" image="receptions-app.jpg" description="Compare formats, controls, fragrance-free choices and costs against the same practice-approved hospitality brief. Explore 50 comparisons with explicit clinical exclusions." path="/clinic-scenting-comparisons" pages={clinicComparisonPages} clusters={clinicComparisonClusters}/>;}
