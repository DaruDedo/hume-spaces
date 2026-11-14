import CatalogueCard from './CatalogueCard';
import { rupees } from '@/lib/commerce/shared';
import CommerceCardActions from './CommerceCardActions';
import Image from 'next/image';
import Link from '@/components/PageProgress';
import {products,industries} from '@/lib/content';
export function ProductCard({product:p,index=0,price=p.price,cartOnly=false}:{product:typeof products[number];index?:number;price?:number;cartOnly?:boolean}){return <CatalogueCard label={p.label} name={p.name} href={`/equipment/${p.slug}`} image={`/images/spaces/${p.image}`} detail={`Coverage: ${p.coverage}*`} price={<p className="product-price">{rupees(price * 100)}</p>} footer={<CommerceCardActions sku={p.slug} name={p.name} cartOnly={cartOnly} />}/>;}
export function IndustryCard({industry:i,index=0}:{industry:typeof industries[number];index?:number}){return <Link className="industry-card" href={`/industries/${i.slug}`}><Image src={`/images/spaces/${i.image}`} alt={`${i.short} setting — illustrative application`} fill sizes="(max-width: 650px) 90vw, 33vw"/><div><span>0{index+1} / APPLICATION</span><h3>{i.name} <b>→</b></h3></div></Link>}




