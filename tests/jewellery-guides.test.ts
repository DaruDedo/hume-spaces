import test from 'node:test';
import assert from 'node:assert/strict';
import {jewelleryGuides,jewelleryClusters} from '../lib/jewellery-guides';
import {buyerGuides} from '../lib/buyer-guides';
import {products} from '../lib/content';
test('50 jewellery education guides have unique routes and preserve merchandise and customer review',()=>{
 assert.equal(jewelleryGuides.length,50);
 assert.equal(new Set(jewelleryGuides.map(p=>p.slug)).size,50);
 assert.equal(jewelleryClusters.reduce((n,c)=>n+c.end-c.start,0),50);
 for(const p of jewelleryGuides){assert.equal(buyerGuides.filter(g=>g.slug===p.slug).length,1,p.slug);assert.ok(products.some(g=>g.slug===p.product));assert.equal(p.questions.length,6);const body=p.sections.map(s=>s[1]).join(' ');assert.match(body,/display-care requirements/);assert.match(body,/fragrance-free/);assert.match(body,/no guaranteed sales/);}
});
