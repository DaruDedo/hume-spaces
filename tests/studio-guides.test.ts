import test from 'node:test';
import assert from 'node:assert/strict';
import {studioGuides,studioClusters} from '../lib/studio-guides';
import {buyerGuides} from '../lib/buyer-guides';
import {products} from '../lib/content';
test('50 studio education pages have canonical routes, member policy and confirmed equipment',()=>{
 assert.equal(studioGuides.length,50);
 assert.equal(new Set(studioGuides.map(g=>g.slug)).size,50);
 assert.equal(studioClusters.reduce((n,c)=>n+c.end-c.start,0),50);
 for(const g of studioGuides){
  assert.equal(buyerGuides.filter(p=>p.slug===g.slug).length,1,g.slug);
  assert.ok(products.some(p=>p.slug===g.product),g.slug);
  assert.equal(g.questions.length,5);
  const body=g.sections.map(s=>s[1]).join(' ');
  assert.match(body,/unscented/);
  assert.match(body,/ventilation/);
  assert.match(body,/No guaranteed/);
  assert.match(body,/larger tank does not establish greater coverage/);
 }
});
