'use client';
import {useState} from 'react';
import Link from 'next/link';
import {ProductCard} from './Cards';
import {products} from '@/lib/content';
export default function EquipmentCatalog({showControls=true}:{showControls?:boolean}){const [filter,setFilter]=useState('All formats');const filtered=products.filter(p=>!showControls||filter==='All formats'||(filter==='Scent machines'?p.slug!=='hume-mini-reed-diffuser-50ml':p.slug==='hume-mini-reed-diffuser-50ml'));return <>{showControls&&<div className="catalog-toolbar"><div className="format-buttons" role="group" aria-label="Filter equipment">{['All formats','Scent machines','Reed diffuser'].map(f=><button key={f} aria-pressed={filter===f} onClick={()=>setFilter(f)}>{f}</button>)}</div><Link className="button outline" href="/selector">Help me choose <span>→</span></Link></div>}<div className="product-grid catalog" aria-live="polite">{filtered.map(p=><ProductCard key={p.slug} product={p} index={products.findIndex(item=>item.slug===p.slug)}/>)}</div></>}


