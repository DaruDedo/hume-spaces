import {PageIntro} from '@/components/Shell';
import {FragranceExplorer} from '@/components/HomeExperience';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Fragrance oils','Explore six scent profiles and enquire about availability and compatibility.','/fragrance-oils');
export default function Oils(){return <><PageIntro eyebrow="FRAGRANCE OILS" title="Choose your fragrance" description="Compare the notes. Enquire about the scent you like."/><section className="wrap section-bottom"><p className="simple-note">These are scent concepts. Confirm oil availability, price and compatibility with your machine before ordering.</p><FragranceExplorer standalone/></section></>}
