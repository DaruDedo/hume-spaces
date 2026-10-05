import Link from 'next/link';
const spaces=[
{name:'Hotels',href:'/industries/hotels',icon:'M4 20V5h16v15M8 9h2m4 0h2M8 13h2m4 0h2M10 20v-3h4v3'},
{name:'Gyms',href:'/industries/gyms',icon:'M3 9v6m3-8v10m12-10v10m3-8v6M6 12h12'},
{name:'Offices',href:'/industries/offices',icon:'M4 20V4h11v16M15 9h5v11M8 8h3m-3 4h3m-3 4h3M2 20h20'},
{name:'Retail',href:'/industries/retail',icon:'M4 10v10h16V10M3 10l2-6h14l2 6M3 10h18M9 20v-6h6v6'},
{name:'Spas',href:'/industries/spas',icon:'M12 20C5 20 3 15 3 11c4 0 7 2 9 5m0 4c7 0 9-5 9-9-4 0-7 2-9 5m0 0c-4-4-4-8 0-12 4 4 4 8 0 12'},
{name:'Resorts',href:'/industries/resorts',industry:'hotels',icon:'M4 20h16M7 20v-9m10 9v-9M4 11l8-7 8 7M10 20v-5h4v5'},
{name:'Showrooms',href:'/industries/showrooms',industry:'retail',icon:'M4 20V5h16v15M4 13h16M10 5v8M14 5v8M9 20v-4h6v4'},
{name:'Salons',href:'/industries/salons',industry:'other',icon:'M9 9l10 10M9 15 19 5M5 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6m0 10a3 3 0 1 0 0 6 3 3 0 0 0 0-6'},
{name:'Cafés',href:'/industries/cafes',industry:'other',icon:'M4 8h12v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8m12 1h2a3 3 0 0 1 0 6h-2M7 3v2m4-2v2'},
{name:'Clinics',href:'/industries/clinics',industry:'other',icon:'M5 20V5h14v15M9 10h6m-3-3v6M10 20v-4h4v4'},
{name:'Malls',href:'/industries/malls',industry:'retail',icon:'M3 20V8h18v12M7 8V4h10v4M7 12h2m6 0h2M10 20v-5h4v5'},
{name:'All spaces',href:'/industries',icon:'M4 4h6v6H4V4m10 0h6v6h-6V4M4 14h6v6H4v-6m10 0h6v6h-6v-6'}
];
export default function SpaceChoices(){return <div className="space-choice-grid">{spaces.map(s=><Link className="space-choice" key={s.name} href={'href' in s&&s.href?s.href:`/selector?industry=${s.industry}&zones=${encodeURIComponent(s.name)}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={s.icon}/></svg><span>{s.name}</span><svg className="space-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5"/></svg></Link>)}</div>}


