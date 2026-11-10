import {JsonLd} from '@/components/StructuredData';
import WhatsAppContact from '@/components/WhatsAppContact';
import {Header,Footer} from '@/components/Shell';
import StorefrontActivity from '@/components/StorefrontActivity';
import Analytics from '@/components/Analytics';
import {brandDescription,servedCities,servedRegions} from '@/lib/brand';
import {siteOrigin} from '@/lib/site';
export default function StorefrontLayout({children}:{children:React.ReactNode}){return <><Analytics/><StorefrontActivity/><Header/><main id="main">{children}</main><Footer/><WhatsAppContact/><JsonLd data={{'@context':'https://schema.org','@graph':[{'@type':'Organization',name:'HUME Spaces',description:brandDescription,areaServed:[...servedCities.map(name=>({'@type':'City',name})),...servedRegions.map(name=>({'@type':'State',name}))],knowsAbout:['Commercial scenting','Signature fragrance development','Private fragrance blends','Aroma solutions for businesses'],telephone:'+919559024822',...(siteOrigin()?{'@id':siteOrigin()+'/#organization',url:siteOrigin()}:{})},{'@type':'WebSite',name:'HUME Spaces',inLanguage:'en-IN',...(siteOrigin()?{url:siteOrigin(),potentialAction:{'@type':'SearchAction',target:{'@type':'EntryPoint',urlTemplate:siteOrigin()+'/search?q={search_term_string}'},'query-input':'required name=search_term_string'}}:{})}]}}/></>}
