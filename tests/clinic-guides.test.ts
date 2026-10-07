import test from 'node:test';
import assert from 'node:assert/strict';
import {clinicGuides,clinicClusters} from '../lib/clinic-guides';
import {buyerGuides} from '../lib/buyer-guides';
test('50 clinic guides preserve clinical exclusions, policy and patient suitability limits',()=>{
 assert.equal(clinicGuides.length,50);
 assert.deepEqual(clinicClusters.flatMap(c=>clinicGuides.slice(c.start,c.end).map(p=>p.slug)),clinicGuides.map(p=>p.slug));
 for(const p of clinicGuides){assert.equal(buyerGuides.filter(g=>g.slug===p.slug).length,1);assert.match(p.sections.map(s=>s[1]).join(' '),/examination, procedure, treatment and recovery/);assert.match(p.questions[2][1],/No universal safe/);assert.notEqual(p.product,'hume-hvac-scenting-system');}
 assert.match(clinicGuides[19].description,/clinical space/);
 assert.match(clinicGuides[23].sections.map(s=>s[1]).join(' '),/choose unscented/);
});
