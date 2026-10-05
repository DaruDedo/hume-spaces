import SpaceChoices from './SpaceChoices';
import FragranceCards from './FragranceCards';
import WhatsAppButton from '@/components/WhatsAppButton';
import Image from 'next/image';
import Link from 'next/link';
import {industries,scents} from '@/lib/content';
import EquipmentCatalog from './EquipmentCatalog';
export function FragranceExplorer({standalone=false,limit}:{standalone?:boolean;limit?:number}){return <FragranceCards limit={limit}/>;}
export default function HomeExperience(){return <div className="simple-home"><section className="simple-hero wrap"><div><p className="eyebrow">HUME SPACES</p><h1>Scent your space.</h1><p className="lede">Find a scent machine and fragrance for your hotel, office, store or studio.</p><div className="fresh-actions"><Link href="/shop" className="button">Products <span aria-hidden="true">→</span></Link><Link href="/fragrance-oils" className="button outline">Fragrances <span aria-hidden="true">→</span></Link></div></div><div className="simple-hero-image"><Image src="/images/spaces/hume-spaces-hero.png" alt="Warm interior with a fragrance vessel" fill priority sizes="(max-width: 750px) 90vw, 50vw"/></div></section><section className="wrap simple-section"><div className="section-heading"><div><h2>Choose a product</h2><p>Scent machines and reed diffusers. Find your fit.</p></div></div><EquipmentCatalog showControls={false}/><p className="footnote">Specifications are indicative. Confirm suitability, price and availability before ordering.</p><Link className="button outline see-all-products" href="/shop">See all products <span>→</span></Link></section><section className="wrap simple-section home-fragrances" aria-labelledby="home-fragrance-title"><div className="section-heading"><div><h2 id="home-fragrance-title">Choose a fragrance</h2><p>Explore the notes. Enquire about your favourite.</p></div></div><FragranceExplorer limit={10}/><p className="footnote">Scent concepts. Confirm oil availability and machine compatibility.</p><Link className="button outline see-all-fragrances" href="/fragrance-oils">See all fragrances <span>→</span></Link></section><section id="discover" className="wrap simple-section"><h2>Choose your space</h2><SpaceChoices/></section><section className="wrap simple-section simple-help"><h2>Need help choosing?</h2><p>Tell us about your space to request a quotation.</p><WhatsAppButton label="Help me choose on WhatsApp"/></section></div>}







