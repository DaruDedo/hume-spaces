import StoreCatalogue from '@/components/StoreCatalogue';
import {PageIntro} from '@/components/Shell';

import {metadata} from '@/lib/site';
export const dynamic = 'force-dynamic';
export const generateMetadata=()=>metadata('Products','Browse scent machines and reed diffusers.','/equipment');
export default async function Equipment(){return <><PageIntro eyebrow="PRODUCTS" title="Choose your equipment" description="Compare diffuser formats, shop in-stock equipment or request a quote."/><section className="wrap section-bottom"><StoreCatalogue category="equipment"/><p className="footnote">Reference specifications need confirmation. Coverage depends on your layout and airflow. Check each product for online availability.</p></section></>}
