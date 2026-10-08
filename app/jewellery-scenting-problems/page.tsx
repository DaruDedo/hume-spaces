import HotelContentHub from '@/components/HotelContentHub';
import {jewelleryProblemPages,jewelleryProblemClusters} from '@/lib/jewellery-problems';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Jewellery Showroom Ambience & Scent Problems: Practical Guides','50 jewellery guides on premium arrival, consultation experience, fragrance distribution, customer feedback and consistent branch identity.','/jewellery-scenting-problems');
export default function Page(){return <HotelContentHub title="Jewellery ambience & scent problems" category="Jewellery showrooms" solutionPath="/industries/retail" image="retail-stores-app.jpg" description="Explore 50 practical guides for jewellery showrooms that want a more considered arrival and consultation experience. Review service, interiors and source issues, then assess any optional fragrance and equipment." path="/jewellery-scenting-problems" pages={jewelleryProblemPages} clusters={jewelleryProblemClusters}/>;}
