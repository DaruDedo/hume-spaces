import HotelContentHub from '@/components/HotelContentHub';
import {automotiveGuides,automotiveClusters} from '@/lib/automotive-guides';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Automotive & Car Showroom Scenting Guides','50 dealership guides on customer zones, signature scent briefs, vehicle-care requirements, airflow and optional HUME equipment.','/automotive-scenting-guides');
export default function Page(){return <HotelContentHub title="Automotive showroom scenting guides" category="Automotive showrooms" solutionPath="/industries/retail" image="retail-stores-app.jpg" description="Explore 50 guides for car showrooms and dealership groups. Plan optional arrival, display-floor and lounge ambience with vehicle-care requirements, customer preferences and air paths documented." path="/automotive-scenting-guides" pages={automotiveGuides} clusters={automotiveClusters}/>;}
