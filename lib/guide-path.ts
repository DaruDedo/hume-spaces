import {buyerGuides} from './buyer-guides';
const rootSlugs=new Set(buyerGuides.map(g=>g.slug));
export function guidePath(slug:string){return rootSlugs.has(slug)?`/${slug}`:`/guides/${slug}`;}
