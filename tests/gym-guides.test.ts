import test from 'node:test';
import assert from 'node:assert/strict';
import {gymGuides,gymClusters} from '../lib/gym-guides';
import {buyerGuides} from '../lib/buyer-guides';
import {products} from '../lib/content';
test('gym education includes 50 distinct canonical pages and valid recommendations',()=>{
 assert.equal(gymGuides.length,50);
 assert.deepEqual(gymClusters.flatMap(c=>gymGuides.slice(c.start,c.end).map(g=>g.slug)),gymGuides.map(g=>g.slug));
 for(const g of gymGuides){assert.equal(buyerGuides.filter(p=>p.slug===g.slug).length,1);assert.ok(products.some(p=>p.slug===g.product));assert.equal(g.questions.length,4);}
 assert.match(gymGuides.find(g=>g.slug==='gym-fragrance-oil-per-month')!.sections.map(s=>s[1]).join(' '),/D × N/);
 assert.match(gymGuides.find(g=>g.slug==='scent-gym-washrooms')!.description,/drainage/);
});
