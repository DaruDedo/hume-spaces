import test from 'node:test';
import assert from 'node:assert/strict';
import {salonGuides,salonClusters} from '../lib/salon-guides';
import {buyerGuides} from '../lib/buyer-guides';
import {products} from '../lib/content';
test('salon education covers 50 canonical topics and keeps treatment controls separate from fragrance',()=>{
 assert.equal(salonGuides.length,50);
 assert.deepEqual(salonClusters.flatMap(c=>salonGuides.slice(c.start,c.end).map(g=>g.slug)),salonGuides.map(g=>g.slug));
 for(const g of salonGuides){assert.equal(buyerGuides.filter(b=>b.slug===g.slug).length,1);assert.ok(products.some(p=>p.slug===g.product));}
 assert.match(salonGuides.find(g=>g.slug==='scent-keratin-treatment-areas')!.description,/Do not use fragrance to mask/);
 assert.match(salonGuides.find(g=>g.slug==='scent-hair-wash-stations')!.sections[1][1],/without exact approval/);
});
