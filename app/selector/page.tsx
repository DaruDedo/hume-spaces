import {Suspense} from 'react';
import {PageIntro} from '@/components/Shell';
import Selector from '@/components/Selector';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Describe your space','Prepare a commercial scenting brief with your area, layout, ventilation and operating hours. Get preliminary guidance for a consultation.','/selector');
export default function Page(){return <><PageIntro eyebrow="THE SPACE SELECTOR" title="Describe your space" description="Choose the application. Add area and airflow. Take a useful brief into your consultation."/><section className="wrap section-bottom"><Suspense fallback={<p>Loading the space selector…</p>}><Selector/></Suspense></section></>}
