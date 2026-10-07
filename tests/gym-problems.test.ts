import test from 'node:test';
import assert from 'node:assert/strict';
import {gymProblemPages,gymProblemClusters} from '../lib/gym-problems';
import {buyerGuides} from '../lib/buyer-guides';
test('gym problem category covers 50 unique articles and separates fragrance from source treatment',()=>{
 assert.equal(gymProblemPages.length,50);
 assert.deepEqual(gymProblemClusters.flatMap(c=>gymProblemPages.slice(c.start,c.end).map(g=>g.slug)),gymProblemPages.map(g=>g.slug));
 for(const g of gymProblemPages){assert.equal(buyerGuides.filter(b=>b.slug===g.slug).length,1);assert.match(g.sections[3][1],/No odour removal/);}
 assert.match(gymProblemPages.find(g=>g.slug==='smell-poorly-ventilated-gym')!.description,/ventilation deficiency/);
 assert.match(gymProblemPages.find(g=>g.slug==='member-complaints-strong-fragrance')!.sections.map(s=>s[1]).join(' '),/pause unwanted scent/);
});
