import test from 'node:test';
import assert from 'node:assert/strict';
import {salonTechnologyPages,salonTechnologyClusters} from '../lib/salon-technology';
import {buyerGuides} from '../lib/buyer-guides';
test('salon technology includes 50 entries and reuses the shared atomization canonical article',()=>{
 assert.equal(salonTechnologyPages.length,50);
 assert.deepEqual(salonTechnologyClusters.flatMap(c=>salonTechnologyPages.slice(c.start,c.end).map(g=>g.slug)),salonTechnologyPages.map(g=>g.slug));
 for(const g of salonTechnologyPages)assert.equal(buyerGuides.filter(b=>b.slug===g.slug).length,1);
 assert.ok(salonTechnologyPages.some(g=>g.slug==='salon-scent-machine-coverage-calculator'));
 assert.match(salonTechnologyPages.find(g=>g.title==='Diffuser for Large Multi-Floor Salon')!.description,/separate zone/);
});
