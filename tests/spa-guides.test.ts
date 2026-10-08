import test from 'node:test';
import assert from 'node:assert/strict';
import {spaGuides,spaClusters} from '../lib/spa-guides';
import {buyerGuides} from '../lib/buyer-guides';
test('50 spa education guides preserve med-spa clinical and hot/wet exclusions',()=>{
 assert.equal(spaGuides.length,50);
 assert.deepEqual(spaClusters.flatMap(c=>spaGuides.slice(c.start,c.end).map(p=>p.slug)),spaGuides.map(p=>p.slug));
 for(const p of spaGuides){assert.equal(buyerGuides.filter(g=>g.slug===p.slug).length,1);assert.match(p.sections.map(s=>s[1]).join(' '),/Med-spa examination, procedure, clinical treatment and recovery/);}
 assert.match(spaGuides[34].sections[1][1],/No steam, waterproof/);
 assert.match(spaGuides[35].description,/Do not assume/);
 assert.match(spaGuides[37].sections[1][1],/not a massage/);
});
