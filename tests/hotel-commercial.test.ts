import test from 'node:test';
import assert from 'node:assert/strict';
import {hotelCommercialPages,hotelCommercialClusters} from '../lib/hotel-commercial';
test('hotel commercial category contains 50 distinct enquiries grouped exactly once',()=>{
 assert.equal(hotelCommercialPages.length,50);
 const grouped=hotelCommercialClusters.flatMap(c=>hotelCommercialPages.slice(c.start,c.end));
 assert.equal(grouped.length,50);
 assert.equal(new Set(grouped.map(g=>g.slug)).size,50);
});
