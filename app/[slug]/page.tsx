import {notFound} from 'next/navigation';
import BuyerGuide from '@/components/BuyerGuide';
import {buyerGuides} from '@/lib/buyer-guides';
import {metadata} from '@/lib/site';
export const dynamicParams=false;
export function generateStaticParams(){return buyerGuides.map(g=>({slug:g.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const g=buyerGuides.find(g=>g.slug===slug);return g?metadata(g.title,g.description,`/${slug}`):{};}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const g=buyerGuides.find(g=>g.slug===slug);if(!g)notFound();return <BuyerGuide guide={g}/>;}
