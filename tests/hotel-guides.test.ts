import test from 'node:test';
import assert from 'node:assert/strict';
import {hotelGuides,hotelClusters} from '../lib/hotel-guides';
test('hotel category has all 50 pages organised once across topic clusters',()=>{
 assert.equal(hotelGuides.length,50);
 const entries=hotelClusters.flatMap(c=>hotelGuides.slice(c.start,c.end));
 assert.equal(entries.length,50);
 assert.equal(new Set(entries.map(g=>g.slug)).size,50);
 const models=new Set(hotelGuides.map(g=>g.product));
 assert.equal(models.size,6);
});
