import HotelContentHub from '@/components/HotelContentHub';
import {studioGuides,studioClusters} from '@/lib/studio-guides';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Pilates, Yoga & Barre Studio Scenting Guides','50 boutique fitness guides on studio identity, class-room policy, zones, fragrance, airflow, equipment and maintenance.','/studio-scenting-guides');
export default function Page(){return <HotelContentHub title="Pilates, yoga & barre scenting guides" category="Boutique fitness studios" solutionPath="/industries/gyms" image="gyms-app.png" description="Explore 50 practical guides for Pilates, yoga, barre and boutique fitness studios. Plan reception and practice areas separately, with member preferences, airflow and optional equipment clearly explained." path="/studio-scenting-guides" pages={studioGuides} clusters={studioClusters}/>;}
