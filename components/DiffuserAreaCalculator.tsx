'use client';
import {useState} from 'react';
import WhatsAppButton from './WhatsAppButton';
export default function DiffuserAreaCalculator({setting="Hotel"}:{setting?:string}){
 const [unit,setUnit]=useState('ft'),[length,setLength]=useState('20'),[width,setWidth]=useState('25'),[height,setHeight]=useState('');
 const l=Number(length),w=Number(width),h=Number(height);
 const valid=length.trim()!==''&&width.trim()!==''&&Number.isFinite(l)&&Number.isFinite(w)&&l>0&&w>0&&l<=100000&&w<=100000;
 const heightValid=height.trim()!==''&&Number.isFinite(h)&&h>0&&h<=100000;
 const area=valid?l*w*(unit==='m'?10.7639104:1):null;
 const volume=valid&&heightValid?l*w*h*(unit==='m'?35.3146667:1):null;
 const format=(n:number)=>n.toLocaleString('en-IN',{maximumFractionDigits:1});
 return <section className="diffuser-calculator" aria-labelledby="calculator-title"><h2 id="calculator-title">Measure your {setting.toLowerCase()} zone</h2><p>Calculate rectangular floor area. This is a measurement tool, not a coverage guarantee or machine-count recommendation.</p><div className="calculator-fields"><label>Units<select value={unit} onChange={e=>setUnit(e.target.value)}><option value="ft">Feet</option><option value="m">Metres</option></select></label><label>Length ({unit})<input type="number" min="0.1" max="100000" step="any" value={length} onChange={e=>setLength(e.target.value)}/></label><label>Width ({unit})<input type="number" min="0.1" max="100000" step="any" value={width} onChange={e=>setWidth(e.target.value)}/></label><label>Ceiling height ({unit}, optional)<input type="number" min="0.1" max="100000" step="any" value={height} onChange={e=>setHeight(e.target.value)}/></label></div><div className="calculator-result" aria-live="polite">{area!==null?<><strong>{format(area)} sq ft</strong><p>Rectangular floor area{volume!==null?` · ${format(volume)} cubic ft approximate volume`:''}</p></>:<p>Enter positive length and width to calculate the area.</p>}</div><p>For irregular floors, add non-overlapping rectangular sections. Send the floor plan, ventilation and room divisions for review before selecting equipment.</p>{area!==null&&<WhatsAppButton topic={`${setting} diffuser enquiry: measured area ${format(area)} sq ft${volume!==null?`, volume ${format(volume)} cubic ft`:''}. Please review equipment suitability, layout and ventilation.`} label="Enquire for this area"/>}</section>;
}
