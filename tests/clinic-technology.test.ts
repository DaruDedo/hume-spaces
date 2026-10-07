import test from 'node:test';
import assert from 'node:assert/strict';
import {clinicTechnologyPages,clinicTechnologyClusters} from '../lib/clinic-technology';
import {buyerGuides} from '../lib/buyer-guides';
test('50 clinic technology pages preserve clinical exclusions and distinguish confirmed specifications',()=>{
 assert.equal(clinicTechnologyPages.length,50);
 assert.deepEqual(clinicTechnologyClusters.flatMap(c=>clinicTechnologyPages.slice(c.start,c.end).map(p=>p.slug)),clinicTechnologyPages.map(p=>p.slug));
 for(const p of clinicTechnologyPages){assert.equal(buyerGuides.filter(g=>g.slug===p.slug).length,1);assert.match(p.sections.map(s=>s[1]).join(' '),/examination, procedure, treatment and recovery/);}
 assert.match(clinicTechnologyPages[20].description,/not a confirmed/);
 assert.match(clinicTechnologyPages[21].sections[1][1],/No decibel/);
 assert.match(clinicTechnologyPages[39].description,/decline HVAC/);
 assert.match(clinicTechnologyPages[34].sections[1][1],/does not double reach/);
});
