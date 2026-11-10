import {PageIntro} from '@/components/Shell';
import WhatsAppButton from '@/components/WhatsAppButton';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Contact HUME Spaces','Enquire about scenting products and fragrances on WhatsApp.','/contact');
export default function Contact(){return <><PageIntro eyebrow="CONTACT" title="Contact HUME Spaces" description="Ask about products, fragrances or a quotation on WhatsApp."/><section className="wrap section-bottom"><h2>+91 9559024822</h2><p>Share your city, space size and the product or fragrance you’re interested in.</p><WhatsAppButton/></section></>}
