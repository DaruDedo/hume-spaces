import test from 'node:test';
import assert from 'node:assert/strict';
import {gymComparisonPages,gymComparisonClusters} from '../lib/gym-comparisons';
import {buyerGuides} from '../lib/buyer-guides';
test('gym comparisons cover 50 decisions with one canonical article per topic and distinct table advice',()=>{
 assert.equal(gymComparisonPages.length,50);
 assert.deepEqual(gymComparisonClusters.flatMap(c=>gymComparisonPages.slice(c.start,c.end).map(g=>g.slug)),gymComparisonPages.map(g=>g.slug));
 for(const g of gymComparisonPages){assert.equal(buyerGuides.filter(p=>p.slug===g.slug).length,1);assert.notEqual(g.rows[0][1],g.rows[0][2]);}
 assert.match(gymComparisonPages.find(g=>g.slug==='eucalyptus-vs-peppermint-fragrance-gyms')!.description,/not confirmed/);
 assert.match(gymComparisonPages.find(g=>g.slug==='buying-vs-renting-gym-scent-machine')!.description,/Not a confirmed HUME/);
});
