import HotelContentHub from '@/components/HotelContentHub';
import {automotiveProblemPages,automotiveProblemClusters} from '@/lib/automotive-problems';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Car Showroom Ambience and Scent Problems','50 dealership guides for source odours, premium ambience, distribution, customer feedback and consistent branch fragrance.','/automotive-scenting-problems');
export default function Page(){return <HotelContentHub title="Automotive ambience & scent problems" category="Automotive showrooms" solutionPath="/industries/retail" image="retail-stores-app.jpg" description="Find practical next steps for showroom ambience, source smells, uneven fragrance and branch consistency. Address sources and facilities issues before considering optional customer-zone scenting." path="/automotive-scenting-problems" pages={automotiveProblemPages} clusters={automotiveProblemClusters}/>;}
