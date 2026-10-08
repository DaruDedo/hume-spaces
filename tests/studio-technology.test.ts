import test from 'node:test';
import assert from 'node:assert/strict';
import {studioTechnologyPages,studioTechnologyClusters} from '../lib/studio-technology';
import {buyerGuides} from '../lib/buyer-guides';
import {products} from '../lib/content';
test('50 studio technology pages preserve canonical topics and specification limits',()=>{
 assert.equal(studioTechnologyPages.length,50);
 assert.equal(new Set(studioTechnologyPages.map(p=>p.slug)).size,50);
 assert.equal(studioTechnologyClusters.reduce((n,c)=>n+c.end-c.start,0),50);
 for(const g of studioTechnologyPages){assert.equal(buyerGuides.filter(p=>p.slug===g.slug).length,1,g.slug);assert.ok(products.some(p=>p.slug===g.product));assert.equal(g.questions.length,6);assert.match(g.sections.map(s=>s[1]).join(' '),/fragrance-free/);}
 assert.match(studioTechnologyPages[22].description,/not confirmed/);
 assert.match(studioTechnologyPages[23].description,/unconfirmed/);
 assert.match(studioTechnologyPages[30].description,/not a confirmed 3,000/);
 assert.equal(studioTechnologyPages[39].product,'hume-hvac-scenting-system');
});
