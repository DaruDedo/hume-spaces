import test from 'node:test';
import assert from 'node:assert/strict';
import {gymFragrancePages,gymFragranceClusters} from '../lib/gym-fragrances';
import {buyerGuides} from '../lib/buyer-guides';
import {scents} from '../lib/content';
test('50 gym fragrance entries use real concepts and one canonical article per topic',()=>{
 assert.equal(gymFragrancePages.length,50);
 assert.deepEqual(gymFragranceClusters.flatMap(c=>gymFragrancePages.slice(c.start,c.end).map(g=>g.slug)),gymFragrancePages.map(g=>g.slug));
 for(const g of gymFragrancePages){assert.equal(buyerGuides.filter(b=>b.slug===g.slug).length,1);for(const name of g.conceptNames)assert.ok(scents.some(s=>s.name===name));}
 for(const slug of ['best-lemon-fragrance-gyms','best-mint-fragrance-gyms','best-clean-musk-fragrance-gyms'])assert.equal(gymFragrancePages.find(g=>g.slug===slug)!.conceptNames.length,0);
 assert.match(gymFragrancePages.find(g=>g.slug==='best-fragrance-womens-fitness-studios')!.description,/do not assign fragrance preferences by gender/);
});
