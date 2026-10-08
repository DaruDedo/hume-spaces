import test from 'node:test';
import assert from 'node:assert/strict';
import {spaComparisonPages,spaComparisonClusters} from '../lib/spa-comparisons';
import {buyerGuides} from '../lib/buyer-guides';
test('50 spa comparisons have unique routes, distinct tables and accurate note/service limits',()=>{
 assert.equal(spaComparisonPages.length,50);
 assert.deepEqual(spaComparisonClusters.flatMap(c=>spaComparisonPages.slice(c.start,c.end).map(p=>p.slug)),spaComparisonPages.map(p=>p.slug));
 for(const p of spaComparisonPages){assert.equal(buyerGuides.filter(g=>g.slug===p.slug).length,1);assert.notEqual(p.rows[0][1],p.rows[0][2]);assert.match(p.sections.map(s=>s[1]).join(' '),/Med-spa examination, procedure, clinical treatment and recovery/);}
 assert.match(spaComparisonPages[38].description,/not a confirmed/);
 assert.match(spaComparisonPages[39].description,/unconfirmed/);
 assert.match(spaComparisonPages[31].description,/does not double coverage/);
 assert.match(spaComparisonPages[46].description,/Not a confirmed/);
});
