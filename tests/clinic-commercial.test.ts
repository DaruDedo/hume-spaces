import test from 'node:test';
import assert from 'node:assert/strict';
import {clinicCommercialPages,clinicCommercialClusters} from '../lib/clinic-commercial';
import {buyerGuides} from '../lib/buyer-guides';
test('50 clinic enquiries have unique routes, clinical exclusions and honest price and service scope',()=>{
 assert.equal(clinicCommercialPages.length,50);
 assert.deepEqual(clinicCommercialClusters.flatMap(c=>clinicCommercialPages.slice(c.start,c.end).map(p=>p.slug)),clinicCommercialPages.map(p=>p.slug));
 for(const p of clinicCommercialPages){assert.equal(buyerGuides.filter(g=>g.slug===p.slug).length,1);assert.match(p.sections.map(s=>s[1]).join(' '),/examination, procedure, treatment and recovery/);assert.match(p.questions[1][1],/not automatically included/);assert.notEqual(p.product,'hume-hvac-scenting-system');}
 assert.match(clinicCommercialPages[26].description,/no nearby HUME office/);
 assert.match(clinicCommercialPages[38].description,/below the 400ml/);
 assert.match(clinicCommercialPages[41].description,/not one scenting zone/);
});
