import {JsonLd} from '@/components/StructuredData';
import type { Metadata } from 'next';
import './globals.css';
import './refresh.css';
import './navigation.css';
import './simplified.css';
import WhatsAppContact from '@/components/WhatsAppContact';
import {Header,Footer} from '@/components/Shell';
import Analytics from '@/components/Analytics';
import {siteOrigin,allowIndexing} from '@/lib/site';
export const metadata: Metadata={metadataBase:siteOrigin()?new URL(siteOrigin()!):undefined,title:{default:'HUME Spaces',template:'%s | HUME Spaces'},description:'Explore commercial scenting equipment and fragrance directions for hotels, gyms, offices and business interiors.',robots:allowIndexing()?{index:true,follow:true}:{index:false,follow:false}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en" data-scroll-behavior="smooth"><body><a className="skip" href="#main">Skip to content</a><Analytics/><Header/><main id="main">{children}</main><Footer/><WhatsAppContact/><JsonLd data={{'@context':'https://schema.org','@graph':[{'@type':'Organization',name:'HUME Spaces',description:'Commercial scenting equipment and fragrance discovery for business properties.',telephone:'+919559024822',...(siteOrigin()?{'@id':siteOrigin()+'/#organization',url:siteOrigin()}:{})},{'@type':'WebSite',name:'HUME Spaces',inLanguage:'en-IN',...(siteOrigin()?{url:siteOrigin(),potentialAction:{'@type':'SearchAction',target:{'@type':'EntryPoint',urlTemplate:siteOrigin()+'/search?q={search_term_string}'},'query-input':'required name=search_term_string'}}:{})}]}}/></body></html>}




