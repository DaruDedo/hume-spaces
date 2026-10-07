import test from 'node:test';
import assert from 'node:assert/strict';
import {clinicProblemPages,clinicProblemClusters} from '../lib/clinic-problems';
import {buyerGuides} from '../lib/buyer-guides';
test('50 clinic problem pages preserve source review, infection controls and patient accommodation',()=>{
 assert.equal(clinicProblemPages.length,50);
 assert.deepEqual(clinicProblemClusters.flatMap(c=>clinicProblemPages.slice(c.start,c.end).map(p=>p.slug)),clinicProblemPages.map(p=>p.slug));
 for(const p of clinicProblemPages){assert.equal(buyerGuides.filter(g=>g.slug===p.slug).length,1);assert.match(p.sections.map(s=>s[1]).join(' '),/examination, procedure, treatment and recovery/);assert.match(p.questions[3][1],/Pause unwanted fragrance/);}
 assert.match(clinicProblemPages[4].sections[1][1],/Do not change dilution/);
 assert.match(clinicProblemPages[41].sections[1][1],/closed door alone/);
 assert.match(clinicProblemPages[43].sections[1][1],/without asking the patient to prove/);
});
