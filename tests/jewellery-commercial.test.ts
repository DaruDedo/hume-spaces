import test from 'node:test';
import assert from 'node:assert/strict';
import {jewelleryCommercialPages,jewelleryCommercialClusters} from '../lib/jewellery-commercial';
import {buyerGuides} from '../lib/buyer-guides';
import {products} from '../lib/content';
test('50 jewellery commercial pages preserve canonical routes, coverage and supply scope',()=>{
 assert.equal(jewelleryCommercialPages.length,50);
 assert.equal(new Set(jewelleryCommercialPages.map(p=>p.slug)).size,50);
 assert.equal(jewelleryCommercialClusters.reduce((n,c)=>n+c.end-c.start,0),50);
 for(const p of jewelleryCommercialPages){assert.equal(buyerGuides.filter(g=>g.slug===p.slug).length,1,p.slug);assert.ok(products.some(g=>g.slug===p.product));assert.equal(p.questions.length,6);const body=p.sections.map(s=>s[1]).join(' ');assert.match(body,/fragrance-free/);assert.match(body,/material-care requirements/);assert.match(body,/installation, warranty and support in writing/);}
 assert.match(jewelleryCommercialPages[39].description,/exceeds one catalog/);
 assert.match(jewelleryCommercialPages[24].description,/no nearby HUME branch/);
});
