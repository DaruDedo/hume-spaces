'use client';
export default function AnalyticsPreferences(){return <button type="button" className="button outline" onClick={()=>window.dispatchEvent(new Event('hume-analytics-preferences'))}>Analytics preferences</button>}
