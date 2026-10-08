import test from 'node:test';
import assert from 'node:assert/strict';
import {spaTechnologyPages,spaTechnologyClusters} from '../lib/spa-technology';
import {buyerGuides} from '../lib/buyer-guides';
test('50 spa technology guides preserve verified features and environment exclusions',()=>{
 assert.equal(spaTechnologyPages.length,50);
 assert.deepEqual(spaTechnologyClusters.flatMap(c=>spaTechnologyPages.slice(c.start,c.end).map(p=>p.slug)),spaTechnologyPages.map(p=>p.slug));
 for(const p of spaTechnologyPages){assert.equal(buyerGuides.filter(g=>g.slug===p.slug).length,1);assert.match(p.sections.map(s=>s[1]).join(' '),/Med-spa examination, procedure, clinical treatment and recovery/);}
 assert.match(spaTechnologyPages[24].description,/not a confirmed/);
 assert.match(spaTechnologyPages[25].sections[1][1],/No decibel/);
 assert.match(spaTechnologyPages[36].sections[1][1],/does not double coverage/);
 assert.match(spaTechnologyPages[45].sections[1][1],/clinical treatment spaces excluded/);
});
