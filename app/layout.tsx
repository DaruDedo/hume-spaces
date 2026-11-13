import {Space_Grotesk,Manrope} from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';
import './refresh.css';
import './navigation.css';
import './simplified.css';
import './commerce.css';
import {brandDescription} from '@/lib/brand';
import {siteOrigin,allowIndexing} from '@/lib/site';
import { PageProgress } from '@/components/PageProgress';
const headingFont=Space_Grotesk({subsets:['latin'],variable:'--font-heading',display:'swap'});
const bodyFont=Manrope({subsets:['latin'],variable:'--font-body',display:'swap'});
export const metadata: Metadata={metadataBase:siteOrigin()?new URL(siteOrigin()!):undefined,title:{default:'HUME Spaces',template:'%s | HUME Spaces'},description:brandDescription,robots:allowIndexing()?{index:true,follow:true}:{index:false,follow:false}};
export default function Layout({children}:{children:React.ReactNode}){return <html className={`${headingFont.variable} ${bodyFont.variable}`} lang="en" data-scroll-behavior="smooth"><body><a className="skip" href="#main">Skip to content</a>{children}<PageProgress /></body></html>}
