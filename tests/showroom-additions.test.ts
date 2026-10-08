import test from 'node:test';
import assert from 'node:assert/strict';
import {automotiveGuides} from '../lib/automotive-guides';
import {jewelleryComparisonPages,jewelleryFragrancePages} from '../lib/jewellery-additional';
import {buyerGuides} from '../lib/buyer-guides';
import {products,scents} from '../lib/content';
test('automotive education and pending jewellery clusters have 150 canonical pages and real recommendations',()=>{
 for(const pages of [automotiveGuides,jewelleryComparisonPages,jewelleryFragrancePages]){assert.equal(pages.length,50);for(const p of pages){assert.equal(buyerGuides.filter(g=>g.slug===p.slug).length,1,p.slug);assert.ok(products.some(g=>g.slug===p.product));assert.equal(p.questions.length,6);}}
 for(const p of automotiveGuides)assert.match(p.sections.map(s=>s[1]).join(' '),/No material compatibility or cabin-scenting approval is assumed/);
 for(const p of jewelleryComparisonPages)assert.equal(p.rows.length,3);
 for(const p of jewelleryFragrancePages)for(const name of p.conceptNames)assert.ok(scents.some(s=>s.name===name));
 for(const i of [30,34,44])assert.equal(jewelleryFragrancePages[i].conceptNames.length,0);
});
