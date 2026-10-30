import {fragranceCatalog} from './fragrance-catalog';
// URLs derive from permanent packing IDs, never editable display names.
export function fragranceSlug(id:string){return id.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
export function fragranceVisual(id:string){const scent=fragranceCatalog.find(s=>s.id===id);return {image:scent?.image||'hume-spaces-hero.png',idealFor:scent?.idealFor};}
export function fragranceEnquiry(s:{id:string;name:string;price:number}){return s.name+' | 100ml | INR '+s.price;}

export function fragranceImages(id:string){const visual=fragranceVisual(id);const generated=visual.image.startsWith('fragrances/')&&visual.image.endsWith('-product-v1.png');return [{image:visual.image,label:generated?'Product concept':'Atmosphere inspiration'},...(generated?[{image:visual.image.replace('-product-v1.png','-atmosphere-v1.png'),label:'Fragrance atmosphere'}]:[])];}
