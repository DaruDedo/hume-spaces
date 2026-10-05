import {Suspense} from 'react';
import {PageIntro} from '@/components/Shell';
import ConsultationForm from '@/components/ConsultationForm';
import {metadata} from '@/lib/site';
export const dynamic='force-dynamic';
export const generateMetadata=()=>metadata('Request a consultation or quotation','Share your business, city, floor area and commercial scenting requirements with HUME Spaces.','/consultation');
export default function Page(){const connected=Boolean(process.env.LEAD_WEBHOOK_URL);return <><PageIntro eyebrow="LET’S DISCUSS YOUR SPACE" title="Request a consultation or quotation" description="Tell us about your business and what you want to explore. Include equipment, oil costs and support questions in your enquiry."/><section className="wrap form-layout section-bottom"><div>{!connected&&<div className="notice">Fill in your details to prepare a WhatsApp enquiry. You review and send the message in WhatsApp.</div>}<Suspense fallback={<p>Loading enquiry form…</p>}><ConsultationForm/></Suspense></div><aside className="result-panel"><p className="eyebrow">FOR YOUR QUOTATION</p><h2>What to include in your quotation</h2><ol><li>Equipment and approved specifications</li><li>Oil compatibility, pack sizes and prices</li><li>Delivery and any installation requirements</li><li>Available support and warranty terms</li></ol><p className="small">Availability, service locations and response times are pending confirmation. Submitting an enquiry does not place an order.</p></aside></section></>}

