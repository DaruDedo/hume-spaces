'use client';
import CommerceCardActions from './CommerceCardActions';
import CatalogueCard from './CatalogueCard';
import { oilPackPrice } from '@/lib/commerce/oil-sizes';
import {fragranceSlug,fragranceVisual} from '@/lib/fragrances';
import {scents} from '@/lib/content';

export default function FragranceCards({limit}:{limit?:number}){return <><div className="simple-home fragrance-catalog-wrap"><div className="product-grid catalog fragrance-catalog" aria-label="Fragrance collection">{scents.slice(0,limit).map(s=>{const visual=fragranceVisual(s.id);const href='/fragrance-oils/'+fragranceSlug(s.id);return <CatalogueCard key={s.id} fragrance name={s.name} href={href} image={'/images/spaces/'+visual.image} detail={s.notes} footer={<CommerceCardActions sku={'oil-'+fragranceSlug(s.id)} name={s.name} oilStartingPrice={oilPackPrice(s.price * 1000, 50)} />}/>;})}</div></div></>}


