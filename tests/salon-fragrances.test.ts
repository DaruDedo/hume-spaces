import test from 'node:test';
import assert from 'node:assert/strict';
import {salonFragrancePages,salonFragranceClusters} from '../lib/salon-fragrances';
import {buyerGuides} from '../lib/buyer-guides';
import {scents} from '../lib/content';
test('50 salon fragrance guides use real concepts and distinguish unconfirmed notes and client preferences',()=>{
 assert.equal(salonFragrancePages.length,50);
 assert.deepEqual(salonFragranceClusters.flatMap(c=>salonFragrancePages.slice(c.start,c.end).map(p=>p.slug)),salonFragrancePages.map(p=>p.slug));
 for(const p of salonFragrancePages){assert.equal(buyerGuides.filter(g=>g.slug===p.slug).length,1);for(const name of p.conceptNames)assert.ok(scents.some(s=>s.name===name));}
 for(const i of [32,33,34,36,46,47])assert.equal(salonFragrancePages[i].conceptNames.length,0);
 assert.match(salonFragrancePages[15].description,/gender/);
 assert.match(salonFragrancePages[16].description,/gender/);
});
