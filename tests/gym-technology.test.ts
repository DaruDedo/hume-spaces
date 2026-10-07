import test from 'node:test';
import assert from 'node:assert/strict';
import {gymTechnologyPages,gymTechnologyClusters} from '../lib/gym-technology';
import {buyerGuides} from '../lib/buyer-guides';
import {products} from '../lib/content';
test('gym technology covers 50 entries with unique canonical articles and verified model references',()=>{
 assert.equal(gymTechnologyPages.length,50);
 assert.deepEqual(gymTechnologyClusters.flatMap(c=>gymTechnologyPages.slice(c.start,c.end).map(g=>g.slug)),gymTechnologyPages.map(g=>g.slug));
 for(const g of gymTechnologyPages){assert.equal(buyerGuides.filter(b=>b.slug===g.slug).length,1);assert.ok(products.some(p=>p.slug===g.product));}
 assert.match(gymTechnologyPages.find(g=>g.slug==='automatic-scent-intensity-control-gyms')!.sections.map(s=>s[1]).join(' '),/No HUME closed-loop intensity sensor/);
 assert.ok(gymTechnologyPages.some(g=>g.slug==='gym-scent-machine-coverage-calculator'));
});
