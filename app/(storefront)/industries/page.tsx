import {PageIntro,Cta} from '@/components/Shell';
import {IndustryCard} from '@/components/Cards';
import {industries} from '@/lib/content';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Commercial scenting applications','Plan scenting for hotels, gyms, offices, retail and spas with guidance for layout, airflow and people.','/industries');
export default function Industries(){return <><PageIntro eyebrow="APPLICATIONS" title="Scenting for your type of space" description="A lobby is not a workout floor. Start with the application and consider each zone on its own terms."/><section className="wrap industry-grid all-industries">{industries.map((i,n)=><IndustryCard key={i.slug} industry={i} index={n}/>)}</section><Cta/></>}
