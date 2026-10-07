import {guidePath} from '@/lib/guide-path';
import BuyerGuide from '@/components/BuyerGuide';
import {buyerGuides} from '@/lib/buyer-guides';
import {JsonLd,breadcrumbData} from '@/components/StructuredData';
import {siteOrigin} from '@/lib/site';
import WhatsAppButton from '@/components/WhatsAppButton';
import Link from 'next/link';
import {notFound,permanentRedirect} from 'next/navigation';
import {PageIntro} from '@/components/Shell';
import {guides} from '@/lib/content';
import {metadata} from '@/lib/site';
export function generateStaticParams(){return guides.map(g=>({slug:g.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const g=guides.find(g=>g.slug===slug);return g?metadata(g.title,g.description,guidePath(slug)):{};}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const g=guides.find(g=>g.slug===slug);if(!g)notFound();const buyer=buyerGuides.find(item=>item.slug===slug);if(buyer)permanentRedirect(guidePath(slug));return <><PageIntro eyebrow="THE HUME SPACES GUIDE" title={g.title} description={g.description}/><article className="article wrap">{g.sections.map(([h,b],n)=><section key={h}><p className="eyebrow">0{n+1}</p><h2>{h}</h2><p>{b}</p><WhatsAppButton topic={`${g.title}: ${h}`}/></section>)}<div className="article-links"><Link className="button" href="/equipment">Explore equipment →</Link><Link className="text-link dark" href="/selector">Prepare your space brief →</Link></div></article><JsonLd data={breadcrumbData([{name:"Home",path:"/"},{name:"Guides",path:"/guides"},{name:g.title,path:`/guides/${slug}`}])}/><JsonLd data={{"@context":"https://schema.org","@type":"Article",headline:g.title,description:g.description,author:{"@type":"Organization",name:"HUME Spaces"},publisher:{"@type":"Organization",name:"HUME Spaces"},...(siteOrigin()?{mainEntityOfPage:siteOrigin()+`/guides/${slug}`}:{})}}/></>}


