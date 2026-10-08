import test from 'node:test';
import assert from 'node:assert/strict';
import {spaCommercialPages,spaCommercialClusters} from '../lib/spa-commercial';
import {buyerGuides} from '../lib/buyer-guides';
test('50 spa enquiries preserve clinical and environmental exclusions with honest service scope',()=>{
 assert.equal(spaCommercialPages.length,50);
 assert.deepEqual(spaCommercialClusters.flatMap(c=>spaCommercialPages.slice(c.start,c.end).map(p=>p.slug)),spaCommercialPages.map(p=>p.slug));
 for(const p of spaCommercialPages){assert.equal(buyerGuides.filter(g=>g.slug===p.slug).length,1);assert.match(p.sections.map(s=>s[1]).join(' '),/Med-spa examination, procedure, clinical treatment and recovery/);assert.match(p.questions[1][1],/not automatically included/);}
 assert.match(spaCommercialPages[28].description,/no nearby HUME/);
 assert.match(spaCommercialPages[40].description,/below the 400ml/);
 assert.match(spaCommercialPages[45].description,/med-spa clinical rooms remain excluded/);
});
