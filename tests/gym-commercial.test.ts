import test from 'node:test';
import assert from 'node:assert/strict';
import {gymCommercialPages,gymCommercialClusters} from '../lib/gym-commercial';
import {buyerGuides} from '../lib/buyer-guides';
import {products} from '../lib/content';
test('50 gym enquiry pages have unique canonical routes and supported product references',()=>{
 assert.equal(gymCommercialPages.length,50);
 assert.deepEqual(gymCommercialClusters.flatMap(c=>gymCommercialPages.slice(c.start,c.end).map(g=>g.slug)),gymCommercialPages.map(g=>g.slug));
 for(const g of gymCommercialPages){assert.equal(buyerGuides.filter(p=>p.slug===g.slug).length,1);assert.ok(products.some(p=>p.slug===g.product));}
 const big=gymCommercialPages.find(g=>g.slug==='aroma-diffuser-10000-sq-ft-gym')!;
 assert.match(big.description,/No single HUME model/);
 assert.match(big.sections.map(s=>s[1]).join(' '),/two units are not an automatic solution/);
 assert.match(gymCommercialPages.find(g=>g.slug==='gym-scenting-company-near-me')!.description,/no nearby HUME branch/);
});
