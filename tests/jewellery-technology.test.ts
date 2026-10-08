import test from 'node:test';
import assert from 'node:assert/strict';
import {jewelleryTechnologyPages,jewelleryTechnologyClusters} from '../lib/jewellery-technology';
import {buyerGuides} from '../lib/buyer-guides';
import {products} from '../lib/content';
test('50 jewellery technology pages preserve unique routes, coverage and feature limits',()=>{
 assert.equal(jewelleryTechnologyPages.length,50);assert.equal(new Set(jewelleryTechnologyPages.map(p=>p.slug)).size,50);assert.equal(jewelleryTechnologyClusters.reduce((n,c)=>n+c.end-c.start,0),50);
 for(const p of jewelleryTechnologyPages){assert.equal(buyerGuides.filter(g=>g.slug===p.slug).length,1,p.slug);assert.ok(products.some(g=>g.slug===p.product));assert.equal(p.questions.length,6);const body=p.sections.map(s=>s[1]).join(' ');assert.match(body,/fragrance-free/);assert.match(body,/qualified review/);assert.match(body,/Polished surfaces do not establish a fixed sizing rule/);}
 assert.match(jewelleryTechnologyPages[39].description,/ratings are unconfirmed/);assert.match(jewelleryTechnologyPages[32].description,/exceeds one catalog/);assert.equal(jewelleryTechnologyPages[10].slug,'how-fragrance-oil-atomisation-works-in-jewellery-showrooms');
});
