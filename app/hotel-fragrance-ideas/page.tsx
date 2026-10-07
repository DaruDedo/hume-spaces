import HotelContentHub from '@/components/HotelContentHub';
import {hotelFragrancePages,hotelFragranceClusters} from '@/lib/hotel-fragrances';
import {metadata} from '@/lib/site';
export const generateMetadata=()=>metadata('Hotel fragrance ideas','Explore 50 hotel fragrance guides by property identity, guest zone and fragrance note, with relevant HUME concepts and equipment.','/hotel-fragrance-ideas');
export default function Page(){return <HotelContentHub title="Hotel fragrance ideas" description="Explore 50 hotel fragrance guides by property identity, guest zone and fragrance note, with relevant HUME concepts and equipment." path="/hotel-fragrance-ideas" pages={hotelFragrancePages} clusters={hotelFragranceClusters}/>;}
