'use client';
import WhatsAppButton from './WhatsAppButton';

import Image from 'next/image';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';

const categories={
 fragrances:{label:'Fragrances',description:'Choose a scent. Check the pairing.',items:[{title:'Explore fragrance profiles',text:'Six scent directions',image:'decorative-diffuser.png',href:'/fragrance-oils'},{title:'Oil compatibility',text:'Know what your machine needs',image:'hume-spaces-hero.png',href:'/guides/fragrance-and-compatibility'}]},
 products:{label:'Products',description:'Compare the equipment.',items:[{title:'Scent machines',text:'Cold-air, tower and HVAC',image:'commercial-diffuser.png',href:'/equipment'},{title:'Reed diffuser',text:'A format for small areas',image:'decorative-diffuser.png',href:'/equipment/hume-mini-reed-diffuser-50ml'}]}
};
type Category=keyof typeof categories;
function MenuCards({category}:{category:Category}){return <div className="nav-image-grid">{categories[category].items.map(item=><Link className="nav-image-card" href={item.href} key={item.title}><div><Image src={`/images/spaces/${item.image}`} alt="" fill sizes="(max-width: 750px) 40vw, 200px"/></div><b>{item.title}<span>→</span></b><small>{item.text}</small></Link>)}</div>}
export default function Navigation(){
 const desktop=useRef<HTMLDivElement>(null);const mobile=useRef<HTMLDetailsElement>(null);const [active,setActive]=useState<Category|null>('fragrances');
 function closeDesktop(){desktop.current?.querySelectorAll('details').forEach(d=>d.open=false)}
 useEffect(()=>{function outside(e:PointerEvent){if(desktop.current&&!desktop.current.contains(e.target as Node))closeDesktop();if(mobile.current&&!mobile.current.contains(e.target as Node))mobile.current.open=false;}document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside)},[]);
 return <>
 <div className="commerce-desktop" ref={desktop} onKeyDown={e=>{if(e.key==='Escape'){const d=(e.target as HTMLElement).closest('details');closeDesktop();d?.querySelector('summary')?.focus();}}}><nav aria-label="Main navigation" onClick={e=>{if((e.target as HTMLElement).closest('a'))closeDesktop();}}>{(Object.keys(categories) as Category[]).map(key=><details key={key} onToggle={e=>{if(e.currentTarget.open)desktop.current?.querySelectorAll('details').forEach(d=>{if(d!==e.currentTarget)d.open=false;})}}><summary>{categories[key].label}<span>⌄</span></summary><div className="desktop-mega"><p className="eyebrow">{categories[key].label}</p><h3>{categories[key].description}</h3><MenuCards category={key}/></div></details>)}<Link className="shop-nav-link" href="/shop">Shop <span>→</span></Link><Link href="/industries">Solutions by space</Link><Link href="/search">Search</Link></nav></div>
 <details className="mobile-menu commerce-mobile" ref={mobile} onKeyDown={e=>{if(e.key==='Escape'&&mobile.current){mobile.current.open=false;mobile.current.querySelector('summary')?.focus();}}}><summary aria-label="Open navigation">☰</summary><nav aria-label="Mobile navigation" onClick={e=>{if((e.target as HTMLElement).closest('a')&&mobile.current)mobile.current.open=false;}}><p className="eyebrow menu-intro">EXPLORE HUME SPACES</p>{(Object.keys(categories) as Category[]).map(key=><section className="mobile-nav-section" key={key}><button aria-expanded={active===key} aria-controls={`menu-${key}`} onClick={()=>setActive(active===key?null:key)}>{categories[key].label}<span>{active===key?'−':'+'}</span></button><div id={`menu-${key}`} hidden={active!==key}><MenuCards category={key}/></div></section>)}<Link className="mobile-shop-card" href="/shop"><div><Image src="/images/spaces/commercial-scent-machine-pro.jpg" alt="" fill sizes="100px"/></div><span><b>Shop</b><small>Browse all scenting products</small></span><strong>→</strong></Link><div className="nav-secondary"><Link href="/industries">Solutions by space <span>→</span></Link><Link href="/selector">Find your equipment <span>→</span></Link><Link href="/guides">Guides & FAQs <span>→</span></Link><Link href="/compare">Compare products <span>→</span></Link><Link href="/search">Search the platform <span>→</span></Link><Link href="/faq">Scenting FAQs <span>→</span></Link><Link href="/contact">Contact HUME Spaces <span>→</span></Link></div><WhatsAppButton label="Enquire on WhatsApp" className="button menu-quote"/></nav></details>
 </>;
}



