import test from 'node:test';
import assert from 'node:assert/strict';
import {salonProblemPages,salonProblemClusters} from '../lib/salon-problems';
import {buyerGuides} from '../lib/buyer-guides';
import {guidePath} from '../lib/guide-path';
test('salon problems cover 50 canonical topics and keep chemical controls separate from optional scent',()=>{
 assert.equal(salonProblemPages.length,50);
 assert.equal(new Set(salonProblemPages.map(p=>p.slug)).size,50);
 assert.equal(salonProblemClusters.flatMap(c=>salonProblemPages.slice(c.start,c.end)).length,50);
 for(const p of salonProblemPages){assert.ok(buyerGuides.some(g=>g.slug===p.slug));assert.equal(guidePath(p.slug),'/'+p.slug);}
 assert.match(salonProblemPages[9].sections.map(s=>s[1]).join(' '),/formaldehyde/);
 assert.match(salonProblemPages[25].description,/ventilation/);
 assert.match(salonProblemPages[46].sections.map(s=>s[1]).join(' '),/unscented/);
});
