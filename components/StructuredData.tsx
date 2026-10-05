import {siteOrigin} from '@/lib/site';
export function JsonLd({data}:{data:unknown}){return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,'\u003c')}}/>}
export function breadcrumbData(items:{name:string;path:string}[]){const origin=siteOrigin();return {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:items.map((i,n)=>({'@type':'ListItem',position:n+1,name:i.name,...(origin?{item:origin+i.path}:{})}))};}
