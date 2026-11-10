import HotelContentHub from '@/components/HotelContentHub';
import {jewelleryCommercialPages,jewelleryCommercialClusters} from '@/lib/jewellery-commercial';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Jewellery Showroom Scenting Solutions India','Compare HUME Spaces machines, approved fragrance supply, signature briefs and permitted-zone enquiries for jewellery showrooms and premium outlets.','/jewellery-scenting-solutions');
export default function Page(){return <HotelContentHub title="Jewellery showroom scenting solutions" category="Jewellery showrooms" solutionPath="/industries/retail" image="retail-stores-app.jpg" description="Explore 50 commercial jewellery topics. Compare equipment and fragrance enquiries by showroom format, zone, area and supplier scope, with display-care and customer preferences reviewed." path="/jewellery-scenting-solutions" pages={jewelleryCommercialPages} clusters={jewelleryCommercialClusters}/>;}
