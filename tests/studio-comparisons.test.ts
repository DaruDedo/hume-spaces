import test from 'node:test';
import assert from 'node:assert/strict';
import {studioComparisonPages,studioComparisonClusters} from '../lib/studio-comparisons';
import {buyerGuides} from '../lib/buyer-guides';
import {products} from '../lib/content';
test('50 studio comparisons have unique canonical routes, tables and honest product scope',()=>{
 assert.equal(studioComparisonPages.length,50);
 assert.equal(new Set(studioComparisonPages.map(p=>p.slug)).size,50);
 assert.equal(studioComparisonClusters.reduce((n,c)=>n+c.end-c.start,0),50);
 for(const p of studioComparisonPages){assert.equal(buyerGuides.filter(g=>g.slug===p.slug).length,1,p.slug);assert.ok(products.some(g=>g.slug===p.product));assert.equal(p.rows.length,3);assert.equal(p.questions.length,6);assert.ok(p.left&&p.right);assert.match(p.sections.map(s=>s[1]).join(' '),/fragrance-free/);}
 for(const i of [38,39,40,43])assert.match(studioComparisonPages[i].description,/unconfirmed/);
 assert.match(studioComparisonPages[46].description,/Rental availability and terms are unconfirmed/);
});
