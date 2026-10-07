import HotelContentHub from '@/components/HotelContentHub';
import {gymGuides,gymClusters} from '@/lib/gym-guides';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Gym & Fitness Scenting Guides','50 practical gym fragrance education guides covering identity, training zones, equipment, member preferences and maintenance.','/gym-scenting-guides');
export default function Page(){return <HotelContentHub title="Gym & fitness scenting guides" category="Gyms & fitness" solutionPath="/industries/gyms" image="gyms-app.png" description="Explore 50 practical guides for gym owners and fitness studios. Plan fragrance by zone, understand equipment and keep member comfort, cleaning and ventilation at the centre." path="/gym-scenting-guides" pages={gymGuides} clusters={gymClusters}/>;}
