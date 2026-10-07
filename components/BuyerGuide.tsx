import {gymProblemPages} from '@/lib/gym-problems';
import {gymTechnologyPages} from '@/lib/gym-technology';
import {gymCommercialPages} from '@/lib/gym-commercial';
import {gymGuides,gymSources} from '@/lib/gym-guides';
import {hotelComparisonPages,hotelComparisonSources} from '@/lib/hotel-comparisons';
import {hotelFragrancePages} from '@/lib/hotel-fragrances';
import {hotelProblemPages,hotelProblemSources} from '@/lib/hotel-problems';
import {hotelTechnologyPages,hotelTechnologySources} from '@/lib/hotel-technology';
import DiffuserAreaCalculator from './DiffuserAreaCalculator';
import {hotelCommercialPages} from '@/lib/hotel-commercial';
import {hotelGuides,hotelSources} from '@/lib/hotel-guides';
import {guidePath} from '@/lib/guide-path';
import {comparisonGuides,comparisonSources} from '@/lib/comparison-guides';
import {hvacGuides,hvacSources} from '@/lib/hvac-guides';
import {machineGuides} from '@/lib/machine-guides';
import Link from 'next/link';
import Image from 'next/image';
import {buyerGuides,buyerGuideSources} from '@/lib/buyer-guides';
import {products,scents} from '@/lib/content';
import {siteOrigin} from '@/lib/site';
import {JsonLd,breadcrumbData} from './StructuredData';
import WhatsAppButton from './WhatsAppButton';
export default function BuyerGuide({guide:g}:{guide:typeof buyerGuides[number]}){
 const isGymProblem=gymProblemPages.some(item=>item.slug===g.slug);
 const isGymTechnology=gymTechnologyPages.some(item=>item.slug===g.slug);
 const isGymCommercial=gymCommercialPages.some(item=>item.slug===g.slug);
 const isGymGuide=isGymProblem||isGymTechnology||isGymCommercial||gymGuides.some(item=>item.slug===g.slug);
 const hotelComparison=hotelComparisonPages.find(item=>item.slug===g.slug);
 const hotelFragrance=hotelFragrancePages.find(item=>item.slug===g.slug);
 const isHotelProblem=hotelProblemPages.some(item=>item.slug===g.slug);
 const isHotelTechnology=hotelTechnologyPages.some(item=>item.slug===g.slug);
 const isHotelCommercial=hotelCommercialPages.some(item=>item.slug===g.slug);
 const hotelHub=hotelComparison?'/hotel-scenting-comparisons':hotelFragrance?'/hotel-fragrance-ideas':isHotelProblem?'/hotel-scenting-problems':isHotelTechnology?'/hotel-diffuser-technology':isHotelCommercial?'/hotel-scenting-solutions':'/hotel-scenting-guides';
 const isHotelGuide=!!hotelComparison||!!hotelFragrance||isHotelProblem||isHotelTechnology||isHotelCommercial||hotelGuides.some(item=>item.slug===g.slug);
 const comparison=hotelComparison||comparisonGuides.find(item=>item.slug===g.slug);
 const isHvacGuide=hvacGuides.some(item=>item.slug===g.slug);
 const sources=isGymGuide?gymSources:hotelComparison||hotelFragrance?hotelComparisonSources:isHotelProblem?hotelProblemSources:isHotelTechnology?hotelTechnologySources:isHotelGuide?hotelSources:comparison?comparisonSources:isHvacGuide?hvacSources:buyerGuideSources;
 const isMachineGuide=isGymTechnology||isGymCommercial||isHotelCommercial||machineGuides.some(item=>item.slug===g.slug);
 const p=products.find(p=>p.slug===g.product)!;
 const path=guidePath(g.slug);
 const related=(isGymProblem?gymProblemPages:isGymTechnology?gymTechnologyPages:isGymCommercial?gymCommercialPages:isGymGuide?gymGuides:hotelComparison?hotelComparisonPages:hotelFragrance?hotelFragrancePages:isHotelProblem?hotelProblemPages:isHotelTechnology?hotelTechnologyPages:isHotelCommercial?hotelCommercialPages:isHotelGuide?hotelGuides:buyerGuides).filter(other=>other.slug!==g.slug&&other.product===g.product).slice(0,3);
 return <article className="wrap buyer-guide">
  <nav aria-label="Breadcrumb"><Link href={isGymProblem?"/gym-scenting-problems":isGymTechnology?"/gym-diffuser-technology":isGymCommercial?"/gym-scenting-solutions":isGymGuide?"/gym-scenting-guides":isHotelGuide?hotelHub:"/guides"}>{isGymProblem?"← Gym freshness & scent problems":isGymTechnology?"← Gym diffuser technology":isGymCommercial?"← Gym equipment & fragrance enquiries":isGymGuide?"← Gym & fitness guides":hotelComparison?"← Hotel comparisons":hotelFragrance?"← Hotel fragrance ideas":isHotelProblem?"← Hotel freshness & scent problems":isHotelTechnology?"← Hotel diffuser technology":isHotelCommercial?"← Hotel equipment & fragrance enquiries":isHotelGuide?"← Hotel scenting guides":"← All guides"}</Link></nav>
  <header><p className="eyebrow">{isGymProblem?"GYMS / PROBLEMS & NEXT STEPS":isGymTechnology?"GYMS & FITNESS / TECHNOLOGY":isGymCommercial?"GYMS & FITNESS / ENQUIRIES":isGymGuide?"GYMS & FITNESS / EDUCATION":hotelComparison?"HOTELS / COMPARE OPTIONS":hotelFragrance?"HOTELS / FRAGRANCE IDEAS":isHotelProblem?"HOTEL PROBLEMS / PRACTICAL NEXT STEPS":isHotelTechnology?"HOTEL DIFFUSERS / TECHNOLOGY":isHotelCommercial?"HOTEL EQUIPMENT & FRAGRANCE ENQUIRIES":isHotelGuide?"HOTEL SCENTING EDUCATION":"INDIA SCENTING BUYER GUIDE"}</p><h1>{g.title}</h1><p className="buyer-answer">{g.description}</p><p className="buyer-byline">By HUME Spaces · Published 7 October 2026</p></header>
  {hotelFragrance&&<section className="hotel-fragrance-picks" aria-labelledby="fragrance-picks"><p className="eyebrow">HUME FRAGRANCE CONCEPTS</p><h2 id="fragrance-picks">Explore these directions</h2><div>{hotelFragrance.conceptNames.map(name=>{const scent=scents.find(s=>s.name===name);return scent?<article key={name}><h3>{name}</h3><p>{scent.notes}</p><WhatsAppButton topic={g.title+': '+name+' availability and approved oil enquiry'} label="Ask about this fragrance"/></article>:null;})}</div><p className="buyer-product-note">Concepts only. Confirm stock, samples, pricing and exact equipment compatibility.</p><Link className="text-link dark" href="/fragrance-oils">Explore all fragrances →</Link></section>}
  {isGymGuide&&!isGymCommercial&&!isGymProblem&&<aside className="hotel-problem-priority"><strong>Fragrance is an optional ambient choice.</strong><p>Keep cleaning, source control and ventilation in place. Review member preferences and pause unwanted scent; no workout or health benefit is promised.</p></aside>}
  {(isHotelProblem||isGymProblem)&&<aside className="hotel-problem-priority"><strong>Address the source first.</strong><p>Fragrance does not remove moisture, smoke contamination, drainage odours or ventilation problems. The product below is an optional ambient format to assess after those issues are resolved.</p></aside>}<section className="buyer-product" aria-labelledby="guide-product-title"><div className="buyer-product-image"><Image src={`/images/spaces/${p.image}`} alt={p.name} fill sizes="(max-width: 650px) 140px, 240px"/></div><div><p className="eyebrow">{isHotelProblem||isGymProblem?"OPTIONAL AMBIENT EQUIPMENT":"EXPLORE HUME SPACES EQUIPMENT"}</p><h2 id="guide-product-title">{p.name}</h2><p className="buyer-product-price">₹{p.price.toLocaleString('en-IN')}</p><p>{p.capacity} reservoir · Listed coverage: {p.coverage}*</p><p className="buyer-product-note">A starting point for a suitable zone. Confirm approved oil, layout, GST, delivery and service scope before ordering.</p><div className="buyer-product-actions"><Link className="button outline" href={`/equipment/${p.slug}`}>Product details →</Link><WhatsAppButton topic={`${g.title}: ${p.name}`} label="Enquire on WhatsApp"/></div></div></section>
  {(g.slug==="commercial-diffuser-coverage-calculator"||g.slug==="gym-scent-machine-coverage-calculator")&&<DiffuserAreaCalculator setting={isGymTechnology?"Gym":"Hotel"}/>}<aside className="buyer-disclosure">{isGymGuide?"Published by HUME Spaces. Equipment suggestions require zone review; no exercise, health or membership outcome is guaranteed.":isHotelGuide?"Published by HUME Spaces. Equipment suggestions are starting points for property review; no guaranteed guest, booking or revenue outcome is claimed.":"Published by HUME Spaces, which sells scenting equipment. Best means the best fit for your brief; this guide does not award rankings or claim independent product testing."}</aside>
  {comparison&&<section className="buyer-comparison" aria-labelledby="comparison-heading"><h2 id="comparison-heading">At a glance</h2><div className="buyer-table-scroll" role="region" aria-label="Format comparison" tabIndex={0}><table><thead><tr><th scope="col">Compare</th><th scope="col">{comparison.left}</th><th scope="col">{comparison.right}</th></tr></thead><tbody>{comparison.rows.map(([label,left,right])=><tr key={label}><th scope="row">{label}</th><td>{left}</td><td>{right}</td></tr>)}</tbody></table></div></section>}
<nav className="buyer-contents" aria-label="On this page"><strong>In this guide</strong>{g.sections.map(([heading],i)=><a href={`#section-${i+1}`} key={heading}>{heading}</a>)}<a href="#buyer-faq">Buyer questions</a></nav>
  <div className="buyer-body">{g.sections.map(([heading,body],i)=><section id={`section-${i+1}`} key={heading}><h2>{heading}</h2><p>{body}</p></section>)}
  <section className="buyer-checklist"><h2>Before you accept a quote</h2><ul><li>Identify the proposed zones and areas to leave unscented.</li><li>Check exact equipment specifications and approved fragrance.</li><li>Request consumption assumptions and itemised ongoing costs.</li><li>Confirm installation responsibilities and written support terms.</li></ul><Link href="/selector" className="text-link dark">Prepare your property brief →</Link></section>
  <section id="buyer-faq"><h2>Buyer questions</h2>{g.questions.map(([q,a])=><details className="simple-disclosure" key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
  <section className="buyer-sources"><h2>Sources and how to use them</h2>{isMachineGuide?<><p>Equipment figures and prices come from the HUME Spaces catalog, reviewed on 7 October 2026. Coverage is indicative; no independent coverage test or guaranteed machine count is claimed.</p><p><Link href="/compare">Compare the listed product specifications →</Link></p><p><Link href={`/equipment/${p.slug}`}>Read the featured model specifications and FAQs →</Link></p></>:<><p>Official provider pages reviewed on 7 October 2026. External sources describe general formats and their own products; they do not verify HUME specifications or replace the supplied installation manual. No independent ranking is claimed.</p>{sources.map(s=><p key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.name} ↗</a> — {s.summary}</p>)}</>}</section>
  <section><h2>Discuss your property with HUME Spaces</h2><p>Send your city, property type, zone area, ventilation and operating hours. Ask for a suitable equipment and approved-fragrance pairing, with all requested services itemised.</p><WhatsAppButton topic={`${g.title}: property enquiry`} label="Send your brief on WhatsApp"/></section>
  <section><h2>Related buying guides</h2><div className="buyer-related">{related.map(r=><Link key={r.slug} href={guidePath(r.slug)}>{r.title} →</Link>)}<Link href="/compare">Compare HUME Spaces products →</Link></div></section></div>
  <JsonLd data={breadcrumbData([{name:'Home',path:'/'},{name:isGymProblem?'Gym freshness and scent problems':isGymTechnology?'Gym diffuser technology':isGymCommercial?'Gym scenting solutions':isGymGuide?'Gym and fitness guides':hotelComparison?'Hotel comparisons':hotelFragrance?'Hotel fragrance ideas':isHotelProblem?'Hotel freshness and scent problems':isHotelTechnology?'Hotel diffuser technology':isHotelCommercial?'Hotel scenting solutions':isHotelGuide?'Hotel scenting guides':'Guides',path:isGymProblem?'/gym-scenting-problems':isGymTechnology?'/gym-diffuser-technology':isGymCommercial?'/gym-scenting-solutions':isGymGuide?'/gym-scenting-guides':isHotelGuide?hotelHub:'/guides'},{name:g.title,path}])}/>
  <JsonLd data={{'@context':'https://schema.org','@type':'Article',headline:g.title,description:g.description,datePublished:'2026-10-07',author:{'@type':'Organization',name:'HUME Spaces'},publisher:{'@type':'Organization',name:'HUME Spaces'},...(siteOrigin()?{mainEntityOfPage:siteOrigin()+path,image:siteOrigin()+`/images/spaces/${p.image}`}:{})}}/>
  <JsonLd data={{'@context':'https://schema.org','@type':'FAQPage',mainEntity:g.questions.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}}/>
 </article>;
}
