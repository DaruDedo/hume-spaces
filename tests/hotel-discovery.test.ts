import test from 'node:test';
import assert from 'node:assert/strict';
import {hotelComparisonPages,hotelComparisonClusters} from '../lib/hotel-comparisons';
import {hotelFragrancePages,hotelFragranceClusters} from '../lib/hotel-fragrances';
import {buyerGuides} from '../lib/buyer-guides';
import {scents} from '../lib/content';
test('both hotel discovery categories cover all requested decisions with canonical articles',()=>{
 for(const [pages,clusters] of [[hotelComparisonPages,hotelComparisonClusters],[hotelFragrancePages,hotelFragranceClusters]] as const){
  assert.equal(pages.length,50);
  assert.deepEqual(clusters.flatMap(c=>pages.slice(c.start,c.end).map(g=>g.slug)),pages.map(g=>g.slug));
  for(const p of pages)assert.equal(buyerGuides.filter(g=>g.slug===p.slug).length,1);
 }
 assert.equal(buyerGuides.filter(g=>g.slug==='nebulizing-vs-ultrasonic-diffuser').length,1);
});
test('fragrance recommendations reference only real catalog concepts and do not invent requested notes',()=>{
 for(const g of hotelFragrancePages)for(const name of g.conceptNames)assert.ok(scents.some(s=>s.name===name),name);
 const spa=hotelComparisonPages.find(g=>g.slug==='lavender-vs-eucalyptus-hotel-spas')!;
 assert.match(spa.sections.map(s=>s[1]).join(' '),/Neither note is a confirmed HUME catalog/);
 assert.match(hotelFragrancePages.find(g=>g.slug==='fig-fragrance-luxury-hotels')!.description,/fig leaf/);
});
