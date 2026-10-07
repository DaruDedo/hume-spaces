import test from 'node:test';
import assert from 'node:assert/strict';
import {hotelProblemPages,hotelProblemClusters} from '../lib/hotel-problems';
test('hotel problem category groups 50 pages and separates fragrance from source remediation',()=>{
 assert.equal(hotelProblemPages.length,50);
 const grouped=hotelProblemClusters.flatMap(c=>hotelProblemPages.slice(c.start,c.end));
 assert.equal(grouped.length,50);
 assert.equal(new Set(grouped.map(p=>p.slug)).size,50);
 for(const p of grouped)assert.ok(p.questions[0][1].includes('No such claim is made'));
});
