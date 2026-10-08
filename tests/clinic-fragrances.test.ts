import test from 'node:test';
import assert from 'node:assert/strict';
import {clinicFragrancePages,clinicFragranceClusters} from '../lib/clinic-fragrances';
import {buyerGuides} from '../lib/buyer-guides';
import {scents} from '../lib/content';
test('50 clinic fragrance guides use real concepts and preserve policy-sensitive unscented choices',()=>{
 assert.equal(clinicFragrancePages.length,50);
 assert.deepEqual(clinicFragranceClusters.flatMap(c=>clinicFragrancePages.slice(c.start,c.end).map(p=>p.slug)),clinicFragrancePages.map(p=>p.slug));
 for(const p of clinicFragrancePages){assert.equal(buyerGuides.filter(g=>g.slug===p.slug).length,1);for(const name of p.conceptNames)assert.ok(scents.some(s=>s.name===name));assert.match(p.sections.map(s=>s[1]).join(' '),/examination, procedure, treatment and recovery/);}
 for(const i of [9,10,13,14,28,32,41,44,46,47])assert.equal(clinicFragrancePages[i].conceptNames.length,0);
 assert.match(clinicFragrancePages[35].description,/does not establish clinical cleanliness/);
});
