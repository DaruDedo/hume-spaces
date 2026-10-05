import WhatsAppButton from '@/components/WhatsAppButton';
import Image from 'next/image';
import Link from 'next/link';
import {products,industries} from '@/lib/content';
export function ProductCard({product:p,index=0}:{product:typeof products[number];index?:number}){return <article className="product-card"><div className="product-image"><Image src={`/images/spaces/${p.image}`} alt={p.name} fill sizes="(max-width: 650px) 90vw, 45vw"/></div><p className="eyebrow">{p.label}</p><h3><Link className="product-card-link" href={`/equipment/${p.slug}`}>{p.name}</Link></h3><p className="product-use">{['For reception areas and open interiors','For lobbies, boutiques and showrooms','For spaces with central air ducts','For desks and small guest areas'][index]}</p><div className="spec-line"><span>Coverage: {p.coverage}*</span></div><div className="simple-card-actions"><WhatsAppButton topic={p.name} label="Interested" className="button whatsapp-button product-interest"/></div></article>}
export function IndustryCard({industry:i,index=0}:{industry:typeof industries[number];index?:number}){return <Link className="industry-card" href={`/industries/${i.slug}`}><Image src={`/images/spaces/${i.image}`} alt={`${i.short} setting — illustrative application`} fill sizes="(max-width: 650px) 90vw, 33vw"/><div><span>0{index+1} / APPLICATION</span><h3>{i.name} <b>→</b></h3></div></Link>}


