import {Space_Grotesk,Manrope} from 'next/font/google';
import {JsonLd} from '@/components/StructuredData';
import type { Metadata } from 'next';
import './globals.css';
import './refresh.css';
import './navigation.css';
import './simplified.css';
import WhatsAppContact from '@/components/WhatsAppContact';
import {Header,Footer} from '@/components/Shell';
import Analytics from '@/components/Analytics';
import {brandDescription,servedCities,servedRegions} from '@/lib/brand';
import {siteOrigin,allowIndexing} from '@/lib/site';
const headingFont=Space_Grotesk({subsets:['latin'],variable:'--font-heading',display:'swap'});
const bodyFont=Manrope({subsets:['latin'],variable:'--font-body',display:'swap'});
export const metadata: Metadata={metadataBase:siteOrigin()?new URL(siteOrigin()!):undefined,title:{default:'HUME Spaces',template:'%s | HUME Spaces'},description:brandDescription,robots:allowIndexing()?{index:true,follow:true}:{index:false,follow:false}};
export default function Layout({children}:{children:React.ReactNode}){return <html className={`${headingFont.variable} ${bodyFont.variable}`} lang="en" data-scroll-behavior="smooth"><body><a className="skip" href="#main">Skip to content</a><Analytics/><Header/><main id="main">{children}</main><Footer/><WhatsAppContact/><JsonLd data={{'@context':'https://schema.org','@graph':[{'@type':'Organization',name:'HUME Spaces',description:brandDescription,areaServed:[...servedCities.map(name=>({'@type':'City',name})),...servedRegions.map(name=>({'@type':'State',name}))],knowsAbout:['Commercial scenting','Signature fragrance development','Private fragrance blends','Aroma solutions for businesses'],telephone:'+919559024822',...(siteOrigin()?{'@id':siteOrigin()+'/#organization',url:siteOrigin()}:{})},{'@type':'WebSite',name:'HUME Spaces',inLanguage:'en-IN',...(siteOrigin()?{url:siteOrigin(),potentialAction:{'@type':'SearchAction',target:{'@type':'EntryPoint',urlTemplate:siteOrigin()+'/search?q={search_term_string}'},'query-input':'required name=search_term_string'}}:{})}]}}/></body></html>}





