import type {MetadataRoute} from 'next';
import {siteOrigin,allowIndexing} from '@/lib/site';
export default function robots():MetadataRoute.Robots{const origin=siteOrigin();return {rules:{userAgent:'*',...(allowIndexing()?{allow:'/',disallow:['/api/']}:{disallow:'/'})},...(origin?{sitemap:origin+'/sitemap.xml'}:{})};}

