import test from 'node:test';
import assert from 'node:assert/strict';
import {studioFragrancePages,studioFragranceClusters} from '../lib/studio-fragrances';
import {buyerGuides} from '../lib/buyer-guides';
import {products,scents} from '../lib/content';
test('50 studio fragrance pages use real concepts and preserve unconfirmed notes and class policy',()=>{
 assert.equal(studioFragrancePages.length,50);
 assert.equal(new Set(studioFragrancePages.map(p=>p.slug)).size,50);
 assert.equal(studioFragranceClusters.reduce((n,c)=>n+c.end-c.start,0),50);
 for(const p of studioFragrancePages){assert.equal(buyerGuides.filter(g=>g.slug===p.slug).length,1,p.slug);assert.ok(products.some(g=>g.slug===p.product));assert.equal(p.questions.length,6);for(const name of p.conceptNames)assert.ok(scents.some(s=>s.name===name),name);assert.match(p.sections.map(s=>s[1]).join(' '),/fragrance-free/);}
 for(const i of [9,10,11,12,13,17,21,22,23,31,35,36,39])assert.equal(studioFragrancePages[i].conceptNames.length,0);
 assert.match(studioFragrancePages[25].description,/rather than assigning fragrance preferences by gender/);
});
