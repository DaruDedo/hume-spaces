type Pair=[string,string];
const briefs:[string,string,string,string,string,string,string][]=[
  [
    "spa-scent-machine-vs-air-freshener",
    "Spa Scent Machine vs Air Freshener",
    "hume-commercial-scent-machine-pro",
    "Scent machine",
    "Air freshener",
    "Uses exact approved liquid and model-supported operation for a reviewed zone.",
    "A broad category; identify whether the actual product is spray, aerosol, plug-in or passive before comparison."
  ],
  [
    "commercial-aroma-diffuser-vs-room-spray-for-spas",
    "Commercial Aroma Diffuser vs Room Spray for Spas",
    "hume-commercial-scent-machine-pro",
    "Commercial diffuser",
    "Room spray",
    "Scheduled operation still needs refills and staff checks.",
    "Manual application depends on timing and instructions; avoid spraying around guests or treatment products."
  ],
  [
    "waterless-diffuser-vs-water-based-diffuser-for-spa",
    "Waterless Diffuser vs Water-Based Diffuser for Spa",
    "hume-commercial-scent-machine-pro",
    "Waterless",
    "Water-based",
    "Uses its prescribed approved-liquid routine without a water refill.",
    "Requires the exact model's water and consumable routine; neither label approves wet-area placement."
  ],
  [
    "cold-air-diffuser-vs-ultrasonic-diffuser-for-spa",
    "Cold-Air Diffuser vs Ultrasonic Diffuser for Spa",
    "hume-commercial-scent-machine-pro",
    "Cold-air",
    "Ultrasonic",
    "Review documented approved-oil atomization and zone specifications.",
    "Review its actual ultrasonic process and prescribed liquid; the label does not prove coverage."
  ],
  [
    "nebulizing-diffuser-vs-ultrasonic-diffuser-for-spa",
    "Nebulizing Diffuser vs Ultrasonic Diffuser for Spa",
    "hume-commercial-scent-machine-pro",
    "Nebulizing",
    "Ultrasonic",
    "Atomizes approved liquid through the specified device process.",
    "Uses a specified ultrasonic mechanism; exact maintenance and liquid approval matter."
  ],
  [
    "commercial-diffuser-vs-home-diffuser-for-luxury-spa",
    "Commercial Diffuser vs Home Diffuser for Luxury Spa",
    "hume-commercial-scent-machine-pro",
    "Commercial label",
    "Home label",
    "Check documented coverage, controls and refill responsibilities.",
    "Check those same specifications rather than approve or reject by label alone."
  ],
  [
    "hvac-scenting-vs-standalone-diffuser-for-spa",
    "HVAC Scenting vs Standalone Diffuser for Spa",
    "hume-hvac-scenting-system",
    "HVAC distribution",
    "Standalone placement",
    "Requires qualified compatibility and served-zone review.",
    "Requires approved local position, power and air-path review; no whole-spa reach is implied."
  ],
  [
    "hvac-diffuser-vs-wall-mounted-spa-diffuser",
    "HVAC Diffuser vs Wall-Mounted Spa Diffuser",
    "hume-hvac-scenting-system",
    "HVAC method",
    "Wall mounting",
    "A distribution approach needing technical integration and exclusions.",
    "A placement method, not proof of duct compatibility; confirm model and bracket approval."
  ],
  [
    "reed-diffuser-vs-aroma-machine-for-spa",
    "Reed Diffuser vs Aroma Machine for Spa",
    "hume-pro-commercial-tower",
    "Reed format",
    "Aroma machine",
    "Passive local impression; HUME reeds list up to 120 sq ft.",
    "A model-supported local zone; tower lists up to 1,500 sq ft, not every spa room."
  ],
  [
    "reed-diffuser-vs-commercial-scent-machine-for-spa",
    "Reed Diffuser vs Commercial Scent Machine for Spa",
    "hume-pro-commercial-tower",
    "Reed diffuser",
    "Commercial machine",
    "Secure passive placement with approved reed liquid and no electronic schedule.",
    "Approved power, supported settings and refill routines for a reviewed zone."
  ],
  [
    "reed-diffuser-vs-hvac-scenting-for-luxury-spa",
    "Reed Diffuser vs HVAC Scenting for Luxury Spa",
    "hume-hvac-scenting-system",
    "Reeds",
    "HVAC",
    "Small local placement with liquid and spill considerations.",
    "Reviewed air-system distribution with installation, servicing and excluded zones."
  ],
  [
    "room-spray-vs-automatic-scent-diffuser-for-spa",
    "Room Spray vs Automatic Scent Diffuser for Spa",
    "hume-commercial-scent-machine-pro",
    "Room spray",
    "Automatic diffuser",
    "Manual application varies with staff routine and handling instructions.",
    "Supported schedules repeat a routine but do not eliminate refills or assess guest comfort."
  ],
  [
    "aerosol-air-freshener-vs-spa-fragrance-diffuser",
    "Aerosol Air Freshener vs Spa Fragrance Diffuser",
    "hume-commercial-scent-machine-pro",
    "Aerosol format",
    "Spa diffuser",
    "Compare actual aerosol refill, dispensing and handling requirements.",
    "Compare exact approved oil, supported settings and recurring costs under the same spa brief."
  ],
  [
    "scent-machine-vs-automatic-aerosol-dispenser-spas",
    "Scent Machine vs Automatic Aerosol Dispenser",
    "hume-commercial-scent-machine-pro",
    "Scent machine",
    "Aerosol dispenser",
    "Uses compatible fragrance liquid and model-specific controls.",
    "Uses its approved aerosol refill and dispensing schedule; automation alone does not establish better performance."
  ],
  [
    "electric-diffuser-vs-reed-diffuser-for-spa-reception",
    "Electric Diffuser vs Reed Diffuser for Spa Reception",
    "hume-commercial-scent-machine-pro",
    "Electric",
    "Reed",
    "Needs approved power, controls and servicing access.",
    "Needs secure spill-conscious position and approved reed liquid; no electronic controls."
  ],
  [
    "aroma-diffuser-vs-scented-candle-for-spa",
    "Aroma Diffuser vs Scented Candle for Spa",
    "hume-commercial-scent-machine-pro",
    "Powered aroma format",
    "Candle",
    "Follow exact power, liquid and placement requirements; no emission-free claim is made.",
    "Adds flame and combustion considerations; follow venue fire and ventilation policy."
  ],
  [
    "commercial-diffuser-vs-scented-candle-for-luxury-spa",
    "Commercial Diffuser vs Scented Candle for Luxury Spa",
    "hume-commercial-scent-machine-pro",
    "Commercial machine",
    "Scented candle",
    "Review documented controls and oil routines for an approved zone.",
    "Ambience format with flame and handling responsibilities; do not assume permitted treatment-room use."
  ],
  [
    "incense-vs-aroma-diffuser-for-spa",
    "Incense vs Aroma Diffuser for Spa",
    "hume-commercial-scent-machine-pro",
    "Incense",
    "Aroma diffuser",
    "Combustion and smoke require venue policy review; no therapeutic outcome is assumed.",
    "Requires approved liquid and operation; not automatically suitable for every guest or room."
  ],
  [
    "fragrance-oil-vs-essential-oil-for-commercial-spa-scenting",
    "Fragrance Oil vs Essential Oil for Commercial Spa Scenting",
    "hume-commercial-scent-machine-pro",
    "Fragrance oil",
    "Essential oil",
    "Use the exact formulation approved for the commercial machine.",
    "Origin does not establish compatibility or sensitivity-free use; treatment oil is not automatically machine liquid."
  ],
  [
    "essential-oil-diffuser-vs-fragrance-oil-diffuser-for-spa",
    "Essential Oil Diffuser vs Fragrance Oil Diffuser for Spa",
    "hume-commercial-scent-machine-pro",
    "Essential-oil device",
    "Fragrance-oil device",
    "Follow the exact device's approved consumables and venue policy.",
    "Use the exact approved formula; do not substitute oils solely because both labels mention diffusion."
  ],
  [
    "signature-fragrance-vs-traditional-aromatherapy-scent",
    "Signature Fragrance vs Traditional Aromatherapy Scent",
    "hume-commercial-scent-machine-pro",
    "Signature composition",
    "Aromatherapy context",
    "An optional brand-identity brief with approved use and supply terms.",
    "A practitioner or venue context distinct from machine fragrance; no therapeutic equivalence is claimed."
  ],
  [
    "signature-spa-scent-vs-regular-room-freshener",
    "Signature Spa Scent vs Regular Room Freshener",
    "hume-pro-commercial-tower",
    "Signature brief",
    "Regular freshener",
    "Defines identity, approved composition, exclusions and feedback.",
    "May focus on a local aroma routine without formula rights or brand governance."
  ],
  [
    "custom-spa-fragrance-vs-ready-made-fragrance",
    "Custom Spa Fragrance vs Ready-Made Fragrance",
    "hume-pro-commercial-tower",
    "Custom development",
    "Catalog concept",
    "Requires confirmed availability, samples, rights and production terms.",
    "Existing concepts still need formulation, stock, price and device-pairing confirmation."
  ],
  [
    "one-signature-scent-vs-multiple-scents-across-a-spa",
    "One Signature Scent vs Multiple Scents Across a Spa",
    "hume-pro-commercial-tower",
    "One composition",
    "Multiple compositions",
    "Can simplify supply while retaining unscented exclusions.",
    "Needs approved boundaries and overlap review; not a different scent in every treatment room by default."
  ],
  [
    "same-fragrance-everywhere-vs-zoned-spa-fragrances",
    "Same Fragrance Everywhere vs Zoned Spa Fragrances",
    "hume-pro-commercial-tower",
    "Same formula",
    "Zoned formulas",
    "A common formula can support identity but settings still vary by zone.",
    "Different compositions need shared-air and treatment-product review to avoid overlap."
  ],
  [
    "reception-only-vs-full-spa-scenting",
    "Reception-Only vs Full-Spa Scenting",
    "hume-commercial-scent-machine-pro",
    "Reception scope",
    "Full-spa scope",
    "A narrower approved arrival trial with staff and guest feedback.",
    "Requires separate decisions for rooms, wet and hot areas; med-spa clinical spaces remain excluded."
  ],
  [
    "centralised-vs-decentralised-spa-scenting",
    "Centralised vs Decentralised Spa Scenting",
    "hume-hvac-scenting-system",
    "Centralised plan",
    "Local zone operation",
    "Requires approved infrastructure and served-area boundaries.",
    "Allows separately reviewed settings and servicing points; no automatic advantage is claimed."
  ],
  [
    "one-large-scent-machine-vs-multiple-small-diffusers",
    "One Large Scent Machine vs Multiple Small Diffusers",
    "800ml-commercial-diffuser",
    "Large device",
    "Multiple devices",
    "Reservoir size alone does not establish greater reach.",
    "Machine count is not total area divided by nominal coverage; each approved zone needs review."
  ],
  [
    "wall-mounted-vs-floor-standing-spa-diffuser",
    "Wall-Mounted vs Floor-Standing Spa Diffuser",
    "hume-pro-commercial-tower",
    "Wall mounting",
    "Floor-standing",
    "Confirm exact mounting approval, hardware and servicing clearance.",
    "Secure approved placement outside guest routes and cleaning paths; tower format does not establish wet-area approval."
  ],
  [
    "portable-vs-fixed-spa-scent-machine",
    "Portable vs Fixed Spa Scent Machine",
    "hume-commercial-scent-machine-pro",
    "Movable placement",
    "Fixed installation",
    "Does not prove battery operation or permission to move a filled unit.",
    "Needs approved location, power or connection and documented servicing access."
  ],
  [
    "small-vs-large-commercial-spa-diffuser",
    "Small vs Large Commercial Spa Diffuser",
    "800ml-commercial-diffuser",
    "Small format",
    "Large format",
    "Housing size alone does not establish a suitable low-intensity setting.",
    "Larger capacity alone does not establish whole-spa reach or guest suitability."
  ],
  [
    "400ml-vs-800ml-spa-scent-machine",
    "400ml vs 800ml Spa Scent Machine",
    "800ml-commercial-diffuser",
    "400ml HUME model",
    "800ml HUME model",
    "₹4,190; 400ml; listed 1,000–2,000 sq ft; Wi-Fi, Bluetooth and app controls.",
    "₹7,950; 800ml; listed up to 2,000 sq ft; larger reservoir does not double coverage."
  ],
  [
    "continuous-vs-interval-scenting-for-spas",
    "Continuous vs Interval Scenting for Spas",
    "hume-commercial-scent-machine-pro",
    "Continuous operation",
    "Interval operation",
    "Confirm actual support and permitted hours; maximum runtime is not automatically appropriate.",
    "Supported intervals can repeat a routine; no universal spa duty cycle is supplied."
  ],
  [
    "low-intensity-vs-high-intensity-spa-fragrance",
    "Low-Intensity vs High-Intensity Spa Fragrance",
    "hume-commercial-scent-machine-pro",
    "Low setting",
    "High setting",
    "A restrained preference is not a sensitivity-free guarantee.",
    "Stronger output is not automatically more luxurious or appropriate; venue policy may require no scent."
  ],
  [
    "manual-scenting-vs-automatic-spa-scenting",
    "Manual Scenting vs Automatic Spa Scenting",
    "hume-commercial-scent-machine-pro",
    "Manual application",
    "Automatic routine",
    "Depends on staff timing and product instructions; do not apply around guests.",
    "Supported schedules still require refills, checks, permission and stop procedures."
  ],
  [
    "timer-controlled-vs-app-controlled-spa-diffuser",
    "Timer-Controlled vs App-Controlled Spa Diffuser",
    "hume-commercial-scent-machine-pro",
    "Timer",
    "App control",
    "Confirm supported schedules and authorised staff responsibilities.",
    "Confirm app and device requirements; remote cloud functions or dashboards are not assumed."
  ],
  [
    "bluetooth-vs-wi-fi-spa-fragrance-machine",
    "Bluetooth vs Wi-Fi Spa Fragrance Machine",
    "hume-commercial-scent-machine-pro",
    "Bluetooth",
    "Wi-Fi",
    "Confirm supported connection and app requirements.",
    "400ml and 800ml list Wi-Fi; connectivity does not prove autonomous intensity sensing or fleet management."
  ],
  [
    "water-based-vs-oil-based-spa-fragrance-systems",
    "Water-Based vs Oil-Based Spa Fragrance Systems",
    "hume-commercial-scent-machine-pro",
    "Water-based",
    "Oil-based",
    "Follow prescribed water, liquid and cleaning instructions.",
    "Follow approved formulation and operation; an oil label does not prove sensitivity-free or wet-area suitability."
  ],
  [
    "white-tea-vs-lavender-fragrance-for-spa",
    "White Tea vs Lavender Fragrance for Spa",
    "hume-pro-commercial-tower",
    "White tea direction",
    "Lavender direction",
    "Ivory Lobby lists white tea with bergamot and cedar; evaluate the whole composition.",
    "Lavender is not a confirmed HUME catalog note; ask about availability without calming or therapeutic claims."
  ],
  [
    "lavender-vs-eucalyptus-fragrance-for-spa",
    "Lavender vs Eucalyptus Fragrance for Spa",
    "hume-pro-commercial-tower",
    "Lavender direction",
    "Eucalyptus direction",
    "Not a confirmed catalog note; request exact formulation and approval.",
    "Also unconfirmed; no breathing, healing or therapeutic benefit is claimed for an enquiry direction."
  ],
  [
    "sandalwood-vs-lavender-fragrance-for-luxury-spa",
    "Sandalwood vs Lavender Fragrance for Luxury Spa",
    "hume-pro-commercial-tower",
    "Sandalwood direction",
    "Lavender direction",
    "Santal Residence lists sandalwood, iris and amber; sample the full approved concept.",
    "Lavender availability needs confirmation; it is not established by another listed concept."
  ],
  [
    "bergamot-vs-white-tea-fragrance-for-spa-reception",
    "Bergamot vs White Tea Fragrance for Spa Reception",
    "hume-pro-commercial-tower",
    "Bergamot direction",
    "White tea direction",
    "Bergamot is part of Ivory Lobby's tea-and-cedar composition.",
    "White tea is in the same concept; these note aspects do not establish two separate confirmed products."
  ],
  [
    "floral-vs-woody-fragrance-for-luxury-spa",
    "Floral vs Woody Fragrance for Luxury Spa",
    "hume-pro-commercial-tower",
    "Floral direction",
    "Woody direction",
    "Neroli in Verdant Courtyard or iris in Santal Residence are listed directions to enquire about.",
    "Santal Residence or Quiet Library offer complete wood-led concepts; preferences are not determined by luxury labels."
  ],
  [
    "citrus-vs-herbal-fragrance-for-wellness-spa",
    "Citrus vs Herbal Fragrance for Wellness Spa",
    "hume-pro-commercial-tower",
    "Citrus direction",
    "Herbal direction",
    "Ivory Lobby includes bergamot with white tea and cedar.",
    "Coastal Gallery includes sage with mineral air and pale woods; herbal does not establish therapy."
  ],
  [
    "signature-scenting-vs-odour-neutralisation-for-spa",
    "Signature Scenting vs Odour Neutralisation for Spa",
    "hume-commercial-scent-machine-pro",
    "Brand fragrance",
    "Source treatment",
    "An optional sensory identity cue in approved zones.",
    "Investigate unwanted sources separately; HUME equipment is not claimed to neutralise odours or repair ventilation."
  ],
  [
    "scent-marketing-vs-traditional-spa-aromatherapy",
    "Scent Marketing vs Traditional Spa Aromatherapy",
    "hume-commercial-scent-machine-pro",
    "Brand ambience",
    "Spa aromatherapy context",
    "Defines optional identity and zone governance.",
    "Practitioner-led treatment context is separate from commercial machine fragrance; no medical equivalence is claimed."
  ],
  [
    "buying-vs-renting-a-commercial-spa-scent-machine",
    "Buying vs Renting a Commercial Spa Scent Machine",
    "800ml-commercial-diffuser",
    "Purchase",
    "Rental",
    "Catalog prices are equipment purchase references with inclusions to confirm.",
    "Not a confirmed standard HUME offer; ask about availability, term, ownership and total charges."
  ],
  [
    "in-house-spa-scenting-vs-managed-scenting-service",
    "In-House Spa Scenting vs Managed Scenting Service",
    "800ml-commercial-diffuser",
    "Venue team",
    "Managed service",
    "Names staff for approved settings, refills and logs.",
    "Needs confirmed visits, responsibilities and costs; not an assumed HUME package."
  ],
  [
    "local-scent-supplier-vs-international-spa-scent-company",
    "Local Scent Supplier vs International Spa Scent Company",
    "hume-commercial-scent-machine-pro",
    "Local supplier",
    "International company",
    "Confirm actual delivery and onsite scope; no nearby HUME branch is assumed.",
    "Company size does not prove better fit; compare documented services and recurring costs."
  ],
  [
    "commercial-spa-scenting-cost-vs-traditional-air-freshening-cost",
    "Commercial Spa Scenting Cost vs Traditional Air-Freshening Cost",
    "hume-commercial-scent-machine-pro",
    "Machine plan",
    "Existing routine",
    "Include hardware, approved oil, measured use, maintenance and staff checks.",
    "Compare actual consumables and staff time over the same period; savings and guest outcomes are not guaranteed."
  ]
];
export const spaComparisonPages=briefs.map(([slug,title,product,left,right,leftAdvice,rightAdvice])=>({slug,title,product,left,right,description:leftAdvice+' '+rightAdvice,rows:[['What to evaluate',leftAdvice,rightAdvice],['Venue approval','Review the same approved zone, environment and treatment-product context.','Review the same guest preferences and unscented exclusions.'],['Costs and responsibilities','Request written equipment, liquid, servicing and staff assumptions.','Compare the same period, hours and included scope.']] as [string,string,string][],sections:[['When to consider '+left,leftAdvice+' Assess the actual spa zone and venue policy.'],['When to consider '+right,rightAdvice+' Request exact documentation rather than choose by the category label.'],['Make a like-for-like decision','For '+title+', compare approved zones, height, air paths, hours, product aromas and guest preferences. Med-spa examination, procedure, clinical treatment and recovery spaces remain excluded. Steam-room, sauna and wet-area approval is not assumed. No universal winner or independently tested ranking is claimed.'],['Review any optional HUME proposal','The featured model is an enquiry starting point for a suitable approved zone. '+leftAdvice+' '+rightAdvice+' Confirm stock, GST, delivery, liquid approval, environmental limits and service scope in writing. Fragrance-free operation may be appropriate; no healing, sedative, therapeutic, air-purification or treatment benefit is claimed.']] as Pair[],questions:[['Which option should I consider?',leftAdvice+' '+rightAdvice],['Does this comparison guarantee savings or guest comfort?','No. Review actual costs, venue policy and guest preferences; no universal safe setting or therapeutic outcome is claimed.'],['Where should equipment not be assumed suitable?','Confirm environmental limits before any hot or wet placement; steam-room and sauna suitability is not confirmed. Keep med-spa clinical spaces and any venue fragrance-free areas excluded.'],['What should I send for a proposal?','Send venue type, city, approved zone area, heights, air paths, hours, product aromas and exclusions. Request written approved-liquid and quote inclusions.'],['Are custom development, rental and managed visits included?','No such inclusion is assumed. Ask about availability, samples, formula rights, quantities, visits and written commercial terms.']] as Pair[]}));
export const spaComparisonClusters=[{title:'Formats, placement and combustion alternatives',start:0,end:18},{title:'Liquids, branding and zone decisions',start:18,end:31},{title:'Capacity, controls and fragrance directions',start:31,end:44},{title:'Source treatment, services and total costs',start:44,end:50}];
