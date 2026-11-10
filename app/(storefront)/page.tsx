import {brandDescription} from '@/lib/brand';
import HomeExperience from '@/components/HomeExperience';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Commercial Scenting & Signature Fragrances in India',brandDescription,'/');
export default function Home(){return <HomeExperience/>;}
