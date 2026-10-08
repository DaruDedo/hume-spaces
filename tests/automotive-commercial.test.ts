import test from 'node:test';
import assert from 'node:assert/strict';
import {automotiveCommercialPages as pages} from '../lib/automotive-commercial';
import {buyerGuides} from '../lib/buyer-guides';
import {products} from '../lib/content';
test('50 automotive enquiries use unique routes, existing products and independent brand scope',()=>{assert.equal(pages.length,50);for(const p of pages){assert.equal(buyerGuides.filter(g=>g.slug===p.slug).length,1);assert.ok(products.some(g=>g.slug===p.product));assert.equal(p.questions.length,6);assert.equal(p.sections.length,4);}for(const p of pages.slice(20,43)){assert.match(p.sections[0][1],/independent supplier/);assert.match(p.sections[0][1],/does not imply manufacturer affiliation/);}assert.equal(pages[36].slug,'skoda-showroom-fragrance-solution');assert.equal(pages[17].product,'hume-hvac-scenting-system');});
