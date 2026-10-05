'use client';
import {usePathname} from 'next/navigation';
import {products,industries,guides} from '@/lib/content';
import WhatsAppButton from './WhatsAppButton';
export default function WhatsAppContact(){const path=usePathname();const slug=path.split('/').pop();const topic=products.find(p=>p.slug===slug)?.name||industries.find(i=>i.slug===slug)?.intro||guides.find(g=>g.slug===slug)?.title||(path==='/fragrance-oils'?'fragrance oils':path==='/shop'||path==='/equipment'?'scenting products':'commercial scenting');return <WhatsAppButton topic={topic} label="WhatsApp enquiry" className="button whatsapp-floating"/>}
