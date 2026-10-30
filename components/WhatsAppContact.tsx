'use client';
import {usePathname} from 'next/navigation';
import {products,industries,guides,scents} from '@/lib/content';
import {fragranceSlug,fragranceEnquiry} from '@/lib/fragrances';
import WhatsAppButton from './WhatsAppButton';
export default function WhatsAppContact(){const path=usePathname();const slug=path.split('/').pop();const fragrance=path.startsWith("/fragrance-oils/")?scents.find(s=>fragranceSlug(s.id)===slug):undefined;const topic=(fragrance?fragranceEnquiry(fragrance):undefined)||products.find(p=>p.slug===slug)?.name||industries.find(i=>i.slug===slug)?.intro||guides.find(g=>g.slug===slug)?.title||(path==='/fragrance-oils'?'fragrance oils':path==='/shop'||path==='/equipment'?'scenting products':'commercial scenting');return <WhatsAppButton topic={topic} label="WhatsApp enquiry" className="button whatsapp-floating"/>}
