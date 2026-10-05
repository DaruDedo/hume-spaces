import Link from 'next/link';
import {PageIntro} from '@/components/Shell';
import {guides,faqs} from '@/lib/content';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Commercial scenting guides and FAQs','Practical guidance on choosing equipment, planning oil costs and checking fragrance compatibility.','/guides');
export default function Page(){return <><PageIntro eyebrow="GUIDES & ANSWERS" title="Commercial scenting guides" description="Practical starting points for equipment selection, ongoing costs and fragrance compatibility."/><section className="wrap section-bottom"><div className="guide-grid">{guides.map((g,n)=><Link href={`/guides/${g.slug}`} className="guide-card" key={g.slug}><p className="eyebrow">GUIDE 0{n+1}</p><h2>{g.title}</h2><p>{g.description}</p><span className="text-link dark">Read guide →</span></Link>)}</div><div className="faq-block"><p className="eyebrow">FREQUENTLY ASKED QUESTIONS</p><h2>Frequently asked questions</h2>{faqs.map(([q,a])=><details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></section></>}
