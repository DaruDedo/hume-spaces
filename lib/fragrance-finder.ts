import {fragranceCatalog} from './fragrance-catalog';
import {fragranceCharacters} from './fragrance-characters';
import {fragranceAudiences} from './fragrance-audiences';
function normalise(text:string){return text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9₹]+/g,' ').trim();}
function contains(query:string,phrase:string){const p=normalise(phrase);return (' '+query+' ').includes(' '+p+' ')||(' '+query+' ').includes(' '+p+'s ');}
export const policyNotes:Record<string,string>={
food:'For a separate entrance or waiting zone only. Keep food preparation, storage and dining areas unscented; use an unscented approach if airflow cannot separate them.',
spa:'For approved reception areas; check treatment aromas and guest preferences. Med-spa clinical areas need a facility policy review.',
auto:'For operator-approved customer areas only. Keep oil and direct discharge away from vehicles and finishes; no vehicle-interior use is assumed.',
sport:'Start with dry reception or lounge areas. Wet areas, poolside and activity zones need a separate placement and suitability review.',
art:'Keep fragrance away from artworks, collections and display cases; obtain curator approval before any trial.',
aviation:'For operator-approved ground lounge areas only; no aircraft cabin use is assumed.',
spiritual:'Respect ritual preferences, ventilation and fragrance-free choices; begin with a small approved trial.',
temple:'Only for operator-approved, non-sensitive commercial areas. Exclude worship, ritual and food-service areas from this general recommendation.',
review:'For a facility-approved, non-clinical reception trial only. Confirm fragrance policy and patient and staff preferences first; retain an unscented option. These are scent options, not a claim of clinical suitability.',
pet:'Begin with an animal-care and facility suitability review. No animal-area fragrance or pet-safe claim is made; discuss any separate human-only reception area with the operator.',
education:'Review the institution’s fragrance policy and student and staff preferences first. No automatic fragrance recommendation for classrooms or shared learning areas.',
senior:'Begin with operator policy and resident preferences, retaining fragrance-free choices. No automatic recommendation for shared resident areas.'
};
const fallback=[{aliases:['bathroom','washroom','restroom','toilet'],ids:['Oceanic Minerals','Aqua','Lime','Dove'],note:'Fragrance complements cleaning and ventilation; it does not remove the source of an odour.'},{aliases:['home','house','bedroom'],ids:['Cotton','Frech Vanilla','Sandal','Mitti'],note:''},{aliases:['lobby','reception','lounge'],ids:['White Tea','Aqua','Cotton','Royal Musk'],note:''},{aliases:['fitness','sport','workout'],ids:['Oceanic Minerals','Lemongrass','Lime','Aqua'],note:''}];
const tagWords:Record<string,string[]>={fresh:['fresh','refreshing'],aquatic:['aquatic','ocean','marine'],citrus:['citrus','lemon','lime'],woody:['woody','wood'],oud:['oud'],floral:['floral','flower','flowers'],clean:['clean','laundry'],soapy:['soap','soapy'],subtle:['subtle','light','mild','gentle'],sweet:['sweet'],vanilla:['vanilla'],amber:['amber','ambery'],musk:['musk','musky'],tea:['tea'],green:['green'],spicy:['spicy','spice'],earthy:['earthy','earth'],rain:['rain','petrichor'],smoky:['smoky','smokey','smoke'],sandalwood:['sandal','sandalwood'],rose:['rose'],lavender:['lavender'],jasmine:['jasmine']};
export function findFragrances(input:string){const raw=input.trim().slice(0,300),query=normalise(raw).replace(/\bclincs?\b/g,'clinic').replace(/\blavendar\b/g,'lavender');const empty=(message:string,note='')=>({matches:[],message,note});if(!query)return empty('Tell us your space or the fragrance character you enjoy.');
if(/\b(unscented|fragrance free|no fragrance|no scent)\b/.test(query))return empty('A fragrance-free brief is a valid choice.','Keep the space unscented if that fits your guests and operating policy.');
const audiences=fragranceAudiences.map(a=>({...a,specificity:Math.max(contains(query,a.name)?1000:0,...a.aliases.map(alias=>contains(query,alias)?alias.length:0))})).filter(a=>a.specificity>0).sort((a,b)=>b.specificity-a.specificity);
const review=audiences.find(a=>['pet','education','senior'].includes(a.policy));if(review)return empty('Start with a suitability review for '+review.name+'.',policyNotes[review.policy]);
const clinic=audiences.some(a=>a.policy==='review')||/\bclinics?\b/.test(query);
if(!clinic&&/\b(hospitals?|patients?|medical)\b/.test(query))return empty('Start with your facility’s fragrance policy.',policyNotes.review);
const clinicIds=['Cherry Blossom','Dove','Lavender','Lotus'];
const excludedTags=new Set<string>();const excludedIds=new Set<string>();let positive=query;
const negativeClauses=[...query.matchAll(/\b(?:not|no|avoid|without|non)\s+(.+?)(?=\b(?:but|with|prefer|under|below|within|budget|for)\b|$)/g)];
for(const clause of negativeClauses){for(const [tag,words] of Object.entries(tagWords))if(words.some(word=>contains(clause[1],word)))excludedTags.add(tag);for(const scent of fragranceCatalog)if(contains(clause[1],scent.name))excludedIds.add(scent.id);positive=positive.replace(clause[0],' ');}
const tags=Object.entries(tagWords).filter(([,words])=>words.some(word=>contains(positive,word))).map(([tag])=>tag);
const scores=new Map<string,{score:number;reason:string}>();function add(id:string,score:number,reason:string){const old=scores.get(id);scores.set(id,{score:(old?.score||0)+score,reason:old?.reason||reason});}
const primary=audiences[0];const notes:string[]=[];
if(clinic){clinicIds.forEach((id,i)=>add(id,40-i,'An option to evaluate at low intensity in a facility-approved non-clinical reception.'));notes.push(policyNotes.review);}
if(primary&&!clinic){for(const [i,id] of primary.ids.entries())add(id,40-i,'A direction to sample for '+primary.name+'.');if(policyNotes[primary.policy])notes.push(policyNotes[primary.policy]);}
for(const a of audiences)if(a.policy==='food'&&!notes.includes(policyNotes.food))notes.push(policyNotes.food);
if(!primary&&!clinic){const f=fallback.find(f=>f.aliases.some(a=>contains(query,a)));if(f){f.ids.forEach((id,i)=>add(id,40-i,'A direction to sample for your space.'));if(f.note)notes.push(f.note);}}
for(const s of fragranceCatalog){const character=fragranceCharacters[s.id];for(const tag of tags)if(character.tags.includes(tag))add(s.id,primary?14:20,'Matches the scent character in your brief.');if(contains(positive,s.name))add(s.id,100,'Matches the fragrance name in your search.');}
const budget=raw.match(/(under|below|less than|within|up to|budget(?: of)?)\s*(?:rs\.?|inr|₹)?\s*(\d[\d,]*)/i);const cap=budget?Number(budget[2].replace(/,/g,'')):Infinity;const exclusive=!!budget&&/^(under|below|less than)$/i.test(budget[1]);
const matches=fragranceCatalog.filter(s=>scores.has(s.id)&&(!clinic||clinicIds.includes(s.id))&&!excludedIds.has(s.id)&&(exclusive?s.price<cap:s.price<=cap)&&!fragranceCharacters[s.id].tags.some(t=>excludedTags.has(t))&&tags.every(tag=>fragranceCharacters[s.id].tags.includes(tag))).map(s=>({...s,...scores.get(s.id)!,character:fragranceCharacters[s.id].character})).sort((a,b)=>b.score-a.score).slice(0,4);
return {matches,note:notes.join(' '),message:matches.length?'Fragrances to explore for your space':'No clear match for this brief. Try another scent character or ask us for a personal recommendation.'};}
