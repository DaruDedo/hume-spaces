import test from 'node:test';
import assert from 'node:assert/strict';
import {spaProblemPages,spaProblemClusters} from '../lib/spa-problems';
import {buyerGuides} from '../lib/buyer-guides';
test('50 spa problem guides preserve source review, guest accommodation and clinical exclusions',()=>{
 assert.equal(spaProblemPages.length,50);
 assert.deepEqual(spaProblemClusters.flatMap(c=>spaProblemPages.slice(c.start,c.end).map(p=>p.slug)),spaProblemPages.map(p=>p.slug));
 for(const p of spaProblemPages){assert.equal(buyerGuides.filter(g=>g.slug===p.slug).length,1);assert.match(p.sections.map(s=>s[1]).join(' '),/Med-spa examination, procedure, clinical treatment and recovery/);}
 assert.match(spaProblemPages[19].sections[1][1],/Do not reduce required disinfection/);
 assert.match(spaProblemPages[38].sections[1][1],/No wet-area or steam-room/);
 assert.match(spaProblemPages[43].sections[1][1],/without dismissing discomfort/);
});
