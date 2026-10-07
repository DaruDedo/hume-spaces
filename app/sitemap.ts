import {guidePath} from '@/lib/guide-path';
import type {MetadataRoute} from 'next';
import {siteOrigin,allowIndexing} from '@/lib/site';
import {products,industries,guides} from '@/lib/content';
export default function sitemap():MetadataRoute.Sitemap{const origin=siteOrigin();if(!origin||!allowIndexing())return [];const paths=['','/equipment','/shop','/industries','/fragrance-oils','/selector','/consultation','/guides','/about','/contact','/privacy','/policies','/compare','/faq','/hotel-scenting-guides','/hotel-scenting-solutions','/hotel-diffuser-technology','/hotel-scenting-problems','/hotel-scenting-comparisons','/hotel-fragrance-ideas','/gym-scenting-guides','/gym-scenting-solutions','/gym-diffuser-technology','/gym-scenting-problems','/gym-scenting-comparisons','/gym-fragrance-ideas','/salon-scenting-guides','/salon-scenting-solutions',...products.map(p=>`/equipment/${p.slug}`),...industries.map(i=>`/industries/${i.slug}`),...guides.map(g=>guidePath(g.slug))];return paths.map(path=>({url:origin+path}));}



