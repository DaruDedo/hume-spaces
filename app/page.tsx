import HomeExperience from '@/components/HomeExperience';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('HUME Spaces','Discover scent machines, fragrance profiles and a simple way to plan scenting for your hotel, gym, office or store.','/');
export default function Home(){return <HomeExperience/>;}
