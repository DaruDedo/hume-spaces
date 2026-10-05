import {PageIntro} from '@/components/Shell';
import EquipmentCatalog from '@/components/EquipmentCatalog';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Products','Browse scent machines and reed diffusers.','/equipment');
export default function Equipment(){return <><PageIntro eyebrow="PRODUCTS" title="Choose your equipment" description="Compare four formats. Open a product for details or request a quote."/><section className="wrap section-bottom"><EquipmentCatalog/><p className="footnote">Reference specifications need confirmation. Coverage depends on your layout and airflow. Prices and availability are confirmed by quotation.</p></section></>}
