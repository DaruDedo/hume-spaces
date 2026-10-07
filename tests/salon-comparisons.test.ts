import test from 'node:test';
import assert from 'node:assert/strict';
import {salonComparisonPages,salonComparisonClusters} from '../lib/salon-comparisons';
import {buyerGuides} from '../lib/buyer-guides';
test('salon comparisons cover 50 unique canonical topics with distinct tables and accurate fragrance limits',()=>{
 assert.equal(salonComparisonPages.length,50);
 assert.deepEqual(salonComparisonClusters.flatMap(c=>salonComparisonPages.slice(c.start,c.end).map(p=>p.slug)),salonComparisonPages.map(p=>p.slug));
 for(const p of salonComparisonPages){assert.equal(buyerGuides.filter(g=>g.slug===p.slug).length,1);assert.notEqual(p.rows[0][1],p.rows[0][2]);assert.doesNotMatch(JSON.stringify(p),/gym|member|workout/i);}
 assert.match(salonComparisonPages[39].description,/not a confirmed/);
 assert.match(salonComparisonPages[41].description,/not a confirmed/);
 assert.match(salonComparisonPages[26].description,/does not double coverage/);
});
