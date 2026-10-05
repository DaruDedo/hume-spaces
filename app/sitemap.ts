import type {MetadataRoute} from 'next';
import {siteOrigin} from '@/lib/site';
import {products,industries,guides} from '@/lib/content';
export default function sitemap():MetadataRoute.Sitemap{const origin=siteOrigin();if(!origin)return [];const paths=['','/equipment','/shop','/industries','/fragrance-oils','/selector','/consultation','/guides','/about','/contact','/privacy','/compare','/faq',...products.map(p=>`/equipment/${p.slug}`),...industries.map(i=>`/industries/${i.slug}`),...guides.map(g=>`/guides/${g.slug}`)];return paths.map(path=>({url:origin+path}));}

