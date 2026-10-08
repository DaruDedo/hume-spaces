import test from 'node:test';
import assert from 'node:assert/strict';
import {buyerGuides} from '../lib/buyer-guides';
import {guides,products} from '../lib/content';
import {guidePath} from '../lib/guide-path';
test('new articles use direct paths while original guides keep their existing paths',()=>{
 for(const g of buyerGuides)assert.equal(guidePath(g.slug),`/${g.slug}`);
 assert.equal(guidePath('choosing-a-scent-machine'),'/guides/choosing-a-scent-machine');
});
test('all requested buyer guides have unique routes, distinct advice and existing recommendations',()=>{
 assert.equal(buyerGuides.length,1455);
 assert.equal(new Set(buyerGuides.map(g=>g.slug)).size,1455);
 const bodies=new Set<string>();
 for(const g of buyerGuides){
  assert.ok(products.some(p=>p.slug===g.product),g.slug);
  assert.ok(guides.some(item=>item.slug===g.slug),g.slug);
  assert.ok(g.sections.length>=4,g.slug);
  assert.ok(g.questions.length>=3,g.slug);
  const body=g.sections.map(s=>s[1]).join(' ');
  assert.ok(!bodies.has(body),'duplicated guide body');
  bodies.add(body);
 }
});
