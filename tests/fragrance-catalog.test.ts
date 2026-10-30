import test from 'node:test';
import assert from 'node:assert/strict';
import {fragranceCatalog} from '../lib/fragrance-catalog';
import {fragranceSlug,fragranceEnquiry} from '../lib/fragrances';
test('packing IDs and 100ml prices preserve the owner supplied fulfilment list',()=>{
const expected=[['Aqua',450],['Aventus',900],['BR 540',600],['Cherry Blossom',580],['Cotton',450],['Dove',450],['Firdaus',490],['Frech Vanilla',500],['Green Tea',420],['Jasmine',600],['Lavender',430],['Lemongrass',400],['Lime',420],['Lotus',470],['Mitti',400],['Nargis Flower',600],['Oceanic Minerals',500],['Ombre Nomade',610],['Oud Bergamot',610],['Royal Musk',420],['Sandal',720],['Sauvage',620],['The Blue',610],['White Oud',900],['White Tea',510]];
assert.deepEqual(fragranceCatalog.map(s=>[s.id,s.price]),expected);
assert.equal(new Set(fragranceCatalog.map(s=>fragranceSlug(s.id))).size,25);
assert.equal(new Set(fragranceCatalog.map(s=>s.name)).size,25);
assert.ok(fragranceCatalog.every(s=>s.volumeMl===100));
});
test('a display name change preserves packing and routing identifiers',()=>{
const original=fragranceCatalog.find(s=>s.id==='White Tea')!;
const renamed={...original,name:'A future name'};
assert.equal(fragranceSlug(renamed.id),fragranceSlug(original.id));
assert.equal(renamed.id,'White Tea');
assert.doesNotMatch(fragranceEnquiry(renamed),/Packing ID/);
assert.match(fragranceEnquiry(renamed),/100ml.*510/);
assert.match(fragranceEnquiry(renamed),/A future name/);
});
