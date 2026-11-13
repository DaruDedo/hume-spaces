import {products} from './content';
import {fragranceSamplesAnswer} from './brand';
import {rupees} from './commerce/shared';
type Product=typeof products[number];

export const refillableDiffuserModels = new Set<string>([
  'hume-commercial-scent-machine-pro',
  '800ml-commercial-diffuser',
  'hume-pro-commercial-tower',
]);

export const diffuserSetupSteps = [
  'With the adapter unplugged from the wall, insert its power pin into the diffuser.',
  'Open the lid and use the handle to lift out the bottle assembly.',
  'Unscrew the bottle from the assembly and fill it with fragrance oil approved for your diffuser.',
  'Screw the bottle back onto the assembly, slide it into the diffuser using the handle, and close the lid.',
  'Plug the adapter into a wall outlet and switch on the diffuser.',
];

export const diffuserDeliverySupport = [
  { label: 'Delivery', detail: 'We deliver across India. Estimated delivery is 5–7 days, depending on your location.' },
  { label: 'Warranty', detail: 'These diffusers are imported directly from China and are sold without a warranty. The manufacturer has no local service presence in India.' },
  { label: 'Repairs and spare parts', detail: 'HUME Spaces is your point of contact after purchase. We help troubleshoot issues, arrange repairs and source compatible spare parts.' },
];

export const diffuserReliability = 'Over six months of sales, HUME Spaces received no customer reports of faults with these diffusers. A clean location, upright placement and stable power help keep them running reliably over time.';

export const diffuserCare = [
  { label: 'Avoid dusty areas', detail: 'Heavy dust can clog the filter and reduce airflow.' },
  { label: 'Keep the diffuser upright', detail: 'Tilting the diffuser with oil inside can let oil leak from the nozzle and reach the circuit board or other electronics.' },
  { label: 'Use a stable power supply', detail: 'Use the supplied adapter and a reliable outlet. Voltage fluctuations or a short circuit can damage the electronics.' },
];

export function productUseCases(p:Product){
  const place=(name:string,slug:string)=>({name,path:`/industries/${slug}`});
  if(p.slug==='car-room-diffuser')return [{name:'Cars',path:'/equipment/car-room-diffuser'},{name:'Office cabins',path:'/industries/offices'},{name:'Small rooms',path:'/equipment/car-room-diffuser'},{name:'Hotel rooms',path:'/industries/hotels'},{name:'Personal desks',path:'/industries/offices'}];
  if(p.slug==='hume-mini-reed-diffuser-50ml')return [place('Hotel desks','hotels'),place('Office desks','offices'),place('Spa reception corners','spas'),place('Salon waiting corners','salons'),place('Café entrance corners','cafes'),place('Resort reception desks','resorts'),place('Boutique counters','retail'),place('Showroom reception desks','showrooms')];
  if(p.slug==='hume-hvac-scenting-system')return [place('Hotel lobbies','hotels'),place('Offices','offices'),place('Mall lounges','malls'),place('Showrooms','showrooms'),place('Retail stores','retail'),place('Resort lounges','resorts'),place('Gym receptions','gyms'),place('Spa receptions','spas'),place('Salon receptions','salons'),place('Separate café entrances','cafes')];
  if(p.slug==='hume-pro-commercial-tower')return [place('Hotel lobbies','hotels'),place('Retail stores','retail'),place('Showrooms','showrooms'),place('Spa receptions','spas'),place('Resort lounges','resorts'),place('Office receptions','offices'),place('Salon receptions','salons'),place('Gym receptions','gyms'),place('Separate café entrances','cafes'),place('Mall concierge areas','malls')];
  return [place('Hotel lobbies','hotels'),place('Gyms','gyms'),place('Offices','offices'),place('Retail stores','retail'),place('Showrooms','showrooms'),place('Salon receptions','salons'),place('Spa receptions','spas'),place('Resort lounges','resorts'),place('Separate café entrances','cafes'),place('Mall concierge areas','malls')];
}
export function productFaqs(p: Product, price = p.price * 100) {
  const personal = p.slug === 'car-room-diffuser';
  const reed = p.slug === 'hume-mini-reed-diffuser-50ml';
  const hvac = p.slug === 'hume-hvac-scenting-system';
  const tower = p.slug === 'hume-pro-commercial-tower';
  const uses = productUseCases(p).map(use => use.name).join(', ');

  return [
    {
      q: `Where can the ${p.name} be used?`,
      a: `Suggested spaces include ${uses}. ${reed ? 'Place it where you want a light fragrance close by.' : hvac ? 'It suits properties with compatible central air distribution.' : 'Choose a location with airflow suited to the area you want to scent.'}`,
    },
    {
      q: `What is the fragrance capacity of the ${p.name}?`,
      a: personal ? 'This is a compact diffuser for personal spaces. Its reservoir volume is currently unlisted.' : `The ${p.name} holds ${p.capacity} of ${reed ? 'reed fragrance' : 'fragrance oil'}.`,
    },
    {
      q: `How much area does the ${p.name} cover?`,
      a: personal ? 'It is designed for cars, cabins and small rooms.' : `Listed coverage is ${p.coverage.toLowerCase()}. ${reed ? 'It works best in a small area such as a desk or corner.' : 'Ceiling height, airflow and room divisions help determine whether this model is the right size.'}`,
    },
    {
      q: `What is the price of the ${p.name}?`,
      a: `The listed equipment price is ${rupees(price)}. For products sold online, checkout shows shipping and the final order total.`,
    },
    {
      q: `Does the ${p.name} have app or wireless control?`,
      a: personal ? 'App and wireless control details are currently unlisted for this compact model.'
        : reed ? 'It works by passive diffusion. The reeds draw up the fragrance and release it into the surrounding air.'
        : hvac ? 'This model connects to central ducting. The operating setup depends on the HVAC equipment and how the zones are arranged.'
        : tower ? 'Yes. The tower has Bluetooth app control and supports multiple schedules.'
        : 'Yes. You can adjust the diffuser through its mobile app using Wi-Fi or Bluetooth.',
    },
    {
      q: `Which fragrance should I use with the ${p.name}?`,
      a: personal ? 'Use the refill approved for the Car & Room Diffuser. Start with a light fragrance for an enclosed space.'
        : reed ? 'Use the liquid made for the Mini Reed Diffuser. Fresh tea, citrus or soft floral profiles are good starting points for a small area.'
        : 'Use a fragrance oil approved for your machine. Try white tea for a light, welcoming scent, citrus for freshness, or soft woods for a warmer character.',
    },
    {q: 'Are fragrance samples available?', a: fragranceSamplesAnswer},
    {
      q: `How often does the ${p.name} need refilling?`,
      a: personal ? 'Refill timing depends on how often and how long you run the diffuser.'
        : reed ? 'The reeds release fragrance continuously. Airflow and temperature affect how quickly the 50 ml bottle is used.'
        : hvac || tower ? 'Your output setting and operating hours determine how quickly the oil is used. Use the oil estimator to plan refills for your schedule.'
        : 'A fill can last up to a month depending on the settings and operating hours. Higher output or longer daily use means refilling sooner.',
    },
    {
      q: `How is the ${p.name} installed or placed?`,
      a: hvac ? 'The diffuser connects to suitable central air ducting. The air-handler layout and the zones it serves determine the connection point.' : p.installation,
    },
    {
      q: `Can one ${p.name} serve separate rooms?`,
      a: personal || reed ? 'This diffuser is best for one local area. Use separate units for rooms where you want independent fragrance.'
        : hvac ? 'A compatible HVAC setup can distribute fragrance through connected ducts. Separately controlled zones may need their own dosing points.'
        : 'A standalone diffuser works best in an open, connected space. Use separate units for enclosed rooms that need their own scent level.',
    },
    {
      q: `What are the ongoing costs of the ${p.name}?`,
      a: personal ? 'The recurring cost is the approved refill. How often you replace it depends on your usage.'
        : reed ? 'Budget for replacement reed fragrance and reeds as needed. Airflow and temperature affect how long each fill lasts.'
        : 'The main recurring cost is fragrance oil. Multiply your estimated monthly oil use by the cost per gram of your selected pack to budget for refills.',
    },
    {
      q: `Does the ${p.name} include delivery, warranty or support?`,
      a: refillableDiffuserModels.has(p.slug) ? diffuserDeliverySupport.map(({detail}) => detail).join(' ')
        : 'We deliver across India, with estimated delivery in 5–7 days depending on location. HUME Spaces provides after-sales help. Warranty and return terms vary by model and order.',
    },
    {
      q: `How do I enquire about the ${p.name}?`,
      a: 'Use the WhatsApp button on this page. Include your city, type of space and approximate area so we can recommend a suitable setup and fragrance pairing.',
    },
  ];
}
