import test from 'node:test';
import assert from 'node:assert/strict';
import {jewelleryProblemPages,jewelleryProblemClusters} from '../lib/jewellery-problems';
import {buyerGuides} from '../lib/buyer-guides';
import {products} from '../lib/content';
test('50 jewellery problem pages preserve premium-service scope and unique canonical routes',()=>{
 assert.equal(jewelleryProblemPages.length,50);assert.equal(new Set(jewelleryProblemPages.map(p=>p.slug)).size,50);assert.equal(jewelleryProblemClusters.reduce((n,c)=>n+c.end-c.start,0),50);
 for(const p of jewelleryProblemPages){assert.equal(buyerGuides.filter(g=>g.slug===p.slug).length,1,p.slug);assert.ok(products.some(g=>g.slug===p.product));assert.equal(p.questions.length,6);const body=p.sections.map(s=>s[1]).join(' ');assert.match(body,/fragrance-free/);assert.match(body,/not a remedy for source odours/);assert.match(body,/no guaranteed sales/);}
 assert.match(jewelleryProblemPages[41].description,/Low price alone does not establish poor ambience/);assert.match(jewelleryProblemPages[33].description,/glass itself does not prove air leakage/);
});
