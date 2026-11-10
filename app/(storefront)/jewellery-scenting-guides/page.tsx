import HotelContentHub from '@/components/HotelContentHub';
import {jewelleryGuides,jewelleryClusters} from '@/lib/jewellery-guides';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Jewellery Showroom Scenting Guides: Brand, Zones & Equipment','50 jewellery retail guides on signature scent briefs, showroom zones, customer preferences, merchandise care, airflow and HUME equipment.','/jewellery-scenting-guides');
export default function Page(){return <HotelContentHub title="Jewellery showroom scenting guides" category="Jewellery showrooms" solutionPath="/industries/retail" image="retail-stores-app.jpg" description="Explore 50 education guides for jewellery stores and premium outlets. Plan optional fragrance around entrances, display floors and consultation lounges, with customer choices and merchandise care clearly considered." path="/jewellery-scenting-guides" pages={jewelleryGuides} clusters={jewelleryClusters}/>;}
