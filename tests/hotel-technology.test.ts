import test from 'node:test';
import assert from 'node:assert/strict';
import {hotelTechnologyPages,hotelTechnologyClusters} from '../lib/hotel-technology';
test('hotel technology category groups all 50 requested pages once',()=>{
 assert.equal(hotelTechnologyPages.length,50);
 const entries=hotelTechnologyClusters.flatMap(c=>hotelTechnologyPages.slice(c.start,c.end));
 assert.equal(entries.length,50);
 assert.equal(new Set(entries.map(p=>p.slug)).size,50);
 assert.ok(entries.some(p=>p.slug==='commercial-diffuser-coverage-calculator'));
});
