import test from 'node:test';
import assert from 'node:assert/strict';
import {clinicComparisonPages,clinicComparisonClusters} from '../lib/clinic-comparisons';
import {buyerGuides} from '../lib/buyer-guides';
test('50 clinic comparisons preserve fragrance-free choice, distinct tables and clinical exclusions',()=>{
 assert.equal(clinicComparisonPages.length,50);
 assert.deepEqual(clinicComparisonClusters.flatMap(c=>clinicComparisonPages.slice(c.start,c.end).map(p=>p.slug)),clinicComparisonPages.map(p=>p.slug));
 for(const p of clinicComparisonPages){assert.equal(buyerGuides.filter(g=>g.slug===p.slug).length,1);assert.notEqual(p.rows[0][1],p.rows[0][2]);assert.match(p.sections.map(s=>s[1]).join(' '),/examination, procedure, treatment and recovery/);}
 assert.match(clinicComparisonPages[14].description,/requires no ambient fragrance purchase/);
 assert.match(clinicComparisonPages[17].description,/Outside the proposed plan/);
 assert.match(clinicComparisonPages[38].description,/not a confirmed/);
 assert.match(clinicComparisonPages[41].description,/not a confirmed/);
});
