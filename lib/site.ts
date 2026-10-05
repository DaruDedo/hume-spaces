import type { Metadata } from 'next';
export function siteOrigin(){ const value=process.env.SITE_ORIGIN; if(!value)return undefined; const url=new URL(value); if(!['https:','http:'].includes(url.protocol))throw new Error('SITE_ORIGIN must use HTTP or HTTPS'); return url.origin; }
export function metadata(title:string,description:string,path:string):Metadata{const origin=siteOrigin();return {title,description,alternates:origin?{canonical:origin+path}:undefined,openGraph:{title:`${title} | HUME Spaces`,description,type:'website',...(origin?{images:[{url:origin+'/images/spaces/hume-spaces-hero.png',alt:'HUME Spaces commercial scenting'}]}:{}),...(origin?{url:origin+path}:{})},twitter:{card:'summary_large_image',title,description}};}


