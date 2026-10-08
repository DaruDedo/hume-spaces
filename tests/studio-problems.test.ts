import test from 'node:test';
import assert from 'node:assert/strict';
import {studioProblemPages,studioProblemClusters} from '../lib/studio-problems';
import {buyerGuides} from '../lib/buyer-guides';
import {products} from '../lib/content';
test('50 studio problem pages preserve source-first advice, unique routes and member choices',()=>{
 assert.equal(studioProblemPages.length,50);
 assert.equal(new Set(studioProblemPages.map(p=>p.slug)).size,50);
 assert.equal(studioProblemClusters.reduce((n,c)=>n+c.end-c.start,0),50);
 for(const g of studioProblemPages){assert.equal(buyerGuides.filter(p=>p.slug===g.slug).length,1,g.slug);assert.ok(products.some(p=>p.slug===g.product));assert.equal(g.questions.length,6);const body=g.sections.map(s=>s[1]).join(' ');assert.match(body,/fragrance-free/);assert.match(body,/not a remedy for the original odour source/);}
 assert.match(studioProblemPages[15].description,/Do not apply machine fragrance oil to mats/);
 assert.match(studioProblemPages[45].description,/does not prove an immediately fragrance-free room/);
});
