import test from 'node:test';
import assert from 'node:assert/strict';
import {spaFragrancePages,spaFragranceClusters} from '../lib/spa-fragrances';
import {buyerGuides} from '../lib/buyer-guides';
import {scents} from '../lib/content';
test('50 spa fragrance guides use real concepts and distinguish unconfirmed notes and zone permission',()=>{
 assert.equal(spaFragrancePages.length,50);
 assert.deepEqual(spaFragranceClusters.flatMap(c=>spaFragrancePages.slice(c.start,c.end).map(p=>p.slug)),spaFragrancePages.map(p=>p.slug));
 for(const p of spaFragrancePages){assert.equal(buyerGuides.filter(g=>g.slug===p.slug).length,1);for(const name of p.conceptNames)assert.ok(scents.some(s=>s.name===name));assert.match(p.sections.map(s=>s[1]).join(' '),/Med-spa examination, procedure, clinical treatment and recovery/);}
 for(const i of [8,10,16,21,23,30,31,32,38,45])assert.equal(spaFragrancePages[i].conceptNames.length,0);
 assert.match(spaFragrancePages[26].description,/gender/);
 assert.match(spaFragrancePages[27].description,/gender/);
});
