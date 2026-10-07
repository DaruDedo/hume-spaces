import test from 'node:test';
import assert from 'node:assert/strict';
import {salonCommercialPages,salonCommercialClusters} from '../lib/salon-commercial';
import {buyerGuides} from '../lib/buyer-guides';
import {products} from '../lib/content';
test('50 salon enquiries have canonical routes, supported recommendations and clear service limits',()=>{
 assert.equal(salonCommercialPages.length,50);
 assert.deepEqual(salonCommercialClusters.flatMap(c=>salonCommercialPages.slice(c.start,c.end).map(g=>g.slug)),salonCommercialPages.map(g=>g.slug));
 for(const g of salonCommercialPages){assert.equal(buyerGuides.filter(b=>b.slug===g.slug).length,1);assert.ok(products.some(p=>p.slug===g.product));}
 assert.match(salonCommercialPages.find(g=>g.slug==='salon-scenting-company-near-me')!.description,/No nearby HUME branch/);
 assert.match(salonCommercialPages.find(g=>g.slug==='custom-signature-scent-salons')!.description,/not an assumed HUME/);
});
