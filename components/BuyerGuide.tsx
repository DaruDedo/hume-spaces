import {hvacGuides,hvacSources} from '@/lib/hvac-guides';
import {machineGuides} from '@/lib/machine-guides';
import Link from 'next/link';
import Image from 'next/image';
import {buyerGuides,buyerGuideSources} from '@/lib/buyer-guides';
import {products} from '@/lib/content';
import {siteOrigin} from '@/lib/site';
import {JsonLd,breadcrumbData} from './StructuredData';
import WhatsAppButton from './WhatsAppButton';
export default function BuyerGuide({guide:g}:{guide:typeof buyerGuides[number]}){
 const isHvacGuide=hvacGuides.some(item=>item.slug===g.slug);
 const sources=isHvacGuide?hvacSources:buyerGuideSources;
 const isMachineGuide=machineGuides.some(item=>item.slug===g.slug);
 const p=products.find(p=>p.slug===g.product)!;
 const path=`/guides/${g.slug}`;
 const related=buyerGuides.filter(other=>other.slug!==g.slug&&other.product===g.product).slice(0,3);
 return <article className="wrap buyer-guide">
  <nav aria-label="Breadcrumb"><Link href="/guides">← All guides</Link></nav>
  <header><p className="eyebrow">INDIA SCENTING BUYER GUIDE</p><h1>{g.title}</h1><p className="buyer-answer">{g.description}</p><p className="buyer-byline">By HUME Spaces · Published 7 October 2026</p></header>
  <section className="buyer-product" aria-labelledby="guide-product-title"><div className="buyer-product-image"><Image src={`/images/spaces/${p.image}`} alt={p.name} fill sizes="(max-width: 650px) 140px, 240px"/></div><div><p className="eyebrow">EXPLORE HUME SPACES EQUIPMENT</p><h2 id="guide-product-title">{p.name}</h2><p className="buyer-product-price">₹{p.price.toLocaleString('en-IN')}</p><p>{p.capacity} reservoir · Listed coverage: {p.coverage}*</p><p className="buyer-product-note">A starting point for a suitable zone. Confirm approved oil, layout, GST, delivery and service scope before ordering.</p><div className="buyer-product-actions"><Link className="button outline" href={`/equipment/${p.slug}`}>Product details →</Link><WhatsAppButton topic={`${g.title}: ${p.name}`} label="Enquire on WhatsApp"/></div></div></section>
  <aside className="buyer-disclosure">Published by HUME Spaces, which sells scenting equipment. “Best” means the best fit for your brief; this guide does not award rankings or claim independent product testing.</aside>
  <nav className="buyer-contents" aria-label="On this page"><strong>In this guide</strong>{g.sections.map(([heading],i)=><a href={`#section-${i+1}`} key={heading}>{heading}</a>)}<a href="#buyer-faq">Buyer questions</a></nav>
  <div className="buyer-body">{g.sections.map(([heading,body],i)=><section id={`section-${i+1}`} key={heading}><h2>{heading}</h2><p>{body}</p></section>)}
  <section className="buyer-checklist"><h2>Before you accept a quote</h2><ul><li>Identify the proposed zones and areas to leave unscented.</li><li>Check exact equipment specifications and approved fragrance.</li><li>Request consumption assumptions and itemised ongoing costs.</li><li>Confirm installation responsibilities and written support terms.</li></ul><Link href="/selector" className="text-link dark">Prepare your property brief →</Link></section>
  <section id="buyer-faq"><h2>Buyer questions</h2>{g.questions.map(([q,a])=><details className="simple-disclosure" key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
  <section className="buyer-sources"><h2>Sources and how to use them</h2>{isMachineGuide?<><p>Equipment figures and prices come from the HUME Spaces catalog, reviewed on 7 October 2026. Coverage is indicative; no independent coverage test or guaranteed machine count is claimed.</p><p><Link href="/compare">Compare the listed product specifications →</Link></p><p><Link href={`/equipment/${p.slug}`}>Read the featured model specifications and FAQs →</Link></p></>:<><p>Official provider pages reviewed on 7 October 2026. External sources describe general formats and their own products; they do not verify HUME specifications or replace the supplied installation manual. No independent ranking is claimed.</p>{sources.map(s=><p key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.name} ↗</a> — {s.summary}</p>)}</>}</section>
  <section><h2>Discuss your property with HUME Spaces</h2><p>Send your city, property type, zone area, ventilation and operating hours. Ask for a suitable equipment and approved-fragrance pairing, with all requested services itemised.</p><WhatsAppButton topic={`${g.title}: property enquiry`} label="Send your brief on WhatsApp"/></section>
  <section><h2>Related buying guides</h2><div className="buyer-related">{related.map(r=><Link key={r.slug} href={`/guides/${r.slug}`}>{r.title} →</Link>)}<Link href="/compare">Compare HUME Spaces products →</Link></div></section></div>
  <JsonLd data={breadcrumbData([{name:'Home',path:'/'},{name:'Guides',path:'/guides'},{name:g.title,path}])}/>
  <JsonLd data={{'@context':'https://schema.org','@type':'Article',headline:g.title,description:g.description,datePublished:'2026-10-07',author:{'@type':'Organization',name:'HUME Spaces'},publisher:{'@type':'Organization',name:'HUME Spaces'},...(siteOrigin()?{mainEntityOfPage:siteOrigin()+path,image:siteOrigin()+`/images/spaces/${p.image}`}:{})}}/>
  <JsonLd data={{'@context':'https://schema.org','@type':'FAQPage',mainEntity:g.questions.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}}/>
 </article>;
}
