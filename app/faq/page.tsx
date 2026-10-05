import {PageIntro} from '@/components/Shell';
import {faqs} from '@/lib/content';
import {metadata} from '@/lib/site';
import {JsonLd} from '@/components/StructuredData';
export const generateMetadata=()=>metadata('Commercial scenting FAQs','Answers about machine coverage, fragrance oil compatibility, quotations, installation and running costs.','/faq');
export default function Faq(){return <><PageIntro eyebrow="HELP & ANSWERS" title="Commercial scenting FAQs" description="Get clear answers before choosing equipment or fragrance oils."/><section className="wrap section-bottom">{faqs.map(([q,a])=><details className="simple-disclosure" key={q}><summary>{q}</summary><p>{a}</p></details>)}</section><JsonLd data={{'@context':'https://schema.org','@type':'FAQPage',mainEntity:faqs.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}}/></>}
