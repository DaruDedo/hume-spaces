'use client';
import CommerceCardActions from './CommerceCardActions';
import Image from 'next/image';
import Link from 'next/link';
import {fragranceSlug,fragranceVisual} from '@/lib/fragrances';
import {scents} from '@/lib/content';

export default function FragranceCards({limit}:{limit?:number}){return <><div className="simple-home fragrance-catalog-wrap"><div className="product-grid catalog fragrance-catalog" aria-label="Fragrance collection">{scents.slice(0,limit).map(s=>{const visual=fragranceVisual(s.id);const href='/fragrance-oils/'+fragranceSlug(s.id);return <article className="product-card fragrance-product-card" key={s.id}><div className="product-image"><Image src={'/images/spaces/'+visual.image} alt={s.name+' atmosphere inspiration'} fill sizes="(max-width: 750px) 90vw, 23vw"/></div><p className="eyebrow">{s.family==='To be confirmed'?'FRAGRANCE OIL':s.family}</p><h3><Link className="product-card-link" href={href}>{s.name}</Link></h3><div className="spec-line"><span>{s.notes}</span></div><div className="simple-card-actions"><CommerceCardActions sku={'oil-'+fragranceSlug(s.id)} name={s.name} packHref={href}/></div></article>;})}</div></div></>}


