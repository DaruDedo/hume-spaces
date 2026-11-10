import { catalogPrices } from '@/lib/commerce/catalog-prices';
import FragranceFinder from '@/components/FragranceFinder';
import WhatsAppButton from '@/components/WhatsAppButton';
import {PageIntro} from '@/components/Shell';
import StoreCatalogue from '@/components/StoreCatalogue';
import {metadata} from '@/lib/site';
export const dynamic = 'force-dynamic';
export const generateMetadata=()=>metadata('Fragrance oils','Explore fragrance profiles and perfumer-led private blends for hotels, gyms, malls and other businesses.','/fragrance-oils');
export default async function Oils(){const prices=await catalogPrices();return <><PageIntro showEnquiry={false} eyebrow="FRAGRANCE OILS" title="Choose your fragrance" description="Compare fragrance notes and shop five pack sizes."/><section className="wrap section-bottom"><FragranceFinder prices={prices}/><p className="simple-note">Check machine compatibility before purchase. Shipping and the tax breakdown appear at checkout.</p><StoreCatalogue category="oil"/><section className="simple-section"><h2>Create a private fragrance blend</h2><p>Our perfumers create signature blends for businesses, with private fragrance development experience for gyms, hotels and malls. Bring a new brief or fragrance reference and discuss samples, development scope and supply for your property.</p><WhatsAppButton topic="a private fragrance blend" label="Discuss a custom blend"/></section></section></>}
