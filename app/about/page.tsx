import WhatsAppButton from '@/components/WhatsAppButton';
import Link from 'next/link';
import {PageIntro,Cta} from '@/components/Shell';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('About HUME Spaces','Explore commercial scenting equipment and fragrance profiles for business interiors.','/about');
export default function About(){return <><PageIntro eyebrow="HUME SPACES" title="About HUME Spaces" description="HUME Spaces focuses on commercial scenting equipment and fragrance discovery for business interiors."/><section className="wrap two-col section-bottom"><div><h2>Scenting for<br/>business interiors</h2><p>Spaces brings equipment and fragrance discovery together for hotels, gyms, offices, retail stores, showrooms and spas.</p>{process.env.NEXT_PUBLIC_HUME_FRAGRANCE_URL&&<a className="text-link dark" href={process.env.NEXT_PUBLIC_HUME_FRAGRANCE_URL}>Explore HUME Fragrance →</a>}</div><div><p>The first step is a practical brief: the application, room size, airflow, operating hours and the fragrance direction you have in mind.</p><p>Equipment, approved oils, pricing and support terms need to be confirmed for your project. Recurring refill plans and managed scenting are potential future offers.</p><WhatsAppButton label="Discuss your project on WhatsApp"/></div></section><Cta/></>}

