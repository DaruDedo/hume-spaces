import test from 'node:test';
import assert from 'node:assert/strict';
import {studioCommercialPages,studioCommercialClusters} from '../lib/studio-commercial';
import {buyerGuides} from '../lib/buyer-guides';
import {products} from '../lib/content';
test('50 studio commercial pages preserve canonical routes, product facts and service limits',()=>{
 assert.equal(studioCommercialPages.length,50);
 assert.equal(new Set(studioCommercialPages.map(p=>p.slug)).size,50);
 assert.equal(studioCommercialClusters.reduce((n,c)=>n+c.end-c.start,0),50);
 for(const g of studioCommercialPages){
  assert.equal(buyerGuides.filter(p=>p.slug===g.slug).length,1,g.slug);
  assert.ok(products.some(p=>p.slug===g.product));
  assert.equal(g.questions.length,6);
  const body=g.sections.map(s=>s[1]).join(' ');
  assert.match(body,/fragrance-free/);
  assert.match(body,/larger reservoir does not establish greater coverage/);
  assert.match(body,/installation, warranty and support in writing/);
 }
 assert.match(studioCommercialPages[39].description,/unconfirmed/);
 assert.match(studioCommercialPages[43].description,/exceeds the listed coverage/);
});
