type Pair=[string,string];
const briefs:[string,string,string,string,string,string,string][]=[
  [
    "clinic-scent-machine-vs-air-freshener",
    "Clinic Scent Machine vs Air Freshener",
    "hume-commercial-scent-machine-pro",
    "Scent machine",
    "Air freshener",
    "Review exact approved liquid, supported controls and practice permission.",
    "This broad category may mean spray, aerosol, plug-in or passive fragrance; identify the actual product."
  ],
  [
    "commercial-diffuser-vs-room-spray-for-aesthetic-clinics",
    "Commercial Diffuser vs Room Spray for Aesthetic Clinics",
    "hume-commercial-scent-machine-pro",
    "Commercial diffuser",
    "Room spray",
    "Supported operation still needs oil, maintenance and an authorised shutdown routine.",
    "Manual application varies by timing and instructions; do not spray around patients."
  ],
  [
    "waterless-diffuser-vs-ultrasonic-diffuser-for-clinics",
    "Waterless Diffuser vs Ultrasonic Diffuser for Clinics",
    "hume-commercial-scent-machine-pro",
    "Waterless format",
    "Ultrasonic format",
    "No prescribed water-refill routine for the approved liquid; not a sensitivity-free claim.",
    "Check the actual mechanism, prescribed liquid and maintenance; many designs use water."
  ],
  [
    "cold-air-diffuser-vs-water-based-diffuser-for-clinic-reception",
    "Cold-Air Diffuser vs Water-Based Diffuser for Clinic Reception",
    "hume-commercial-scent-machine-pro",
    "Cold-air format",
    "Water-based format",
    "Review the approved atomization process and local zone specification.",
    "Review the model's water and consumable routine; the label does not establish clinical suitability."
  ],
  [
    "nebulizing-vs-ultrasonic-diffuser-for-clinics",
    "Nebulizing vs Ultrasonic Diffuser for Clinics",
    "hume-commercial-scent-machine-pro",
    "Nebulizing",
    "Ultrasonic",
    "Atomizes approved liquid through the device's specified process.",
    "Uses its specified ultrasonic mechanism; exact liquid approval and coverage need documentation."
  ],
  [
    "commercial-diffuser-vs-home-diffuser-for-clinic-reception",
    "Commercial Diffuser vs Home Diffuser for Clinic Reception",
    "hume-commercial-scent-machine-pro",
    "Commercial label",
    "Home label",
    "Check documented operation, coverage and servicing responsibilities.",
    "Check the same specifications rather than rejecting or approving equipment solely by its label."
  ],
  [
    "reed-diffuser-vs-scent-machine-for-aesthetic-clinic",
    "Reed Diffuser vs Scent Machine for Aesthetic Clinic",
    "hume-pro-commercial-tower",
    "Reed diffuser",
    "Scent machine",
    "Passive local format; HUME reeds list up to 120 sq ft with secure placement to confirm.",
    "Model-supported local operation still requires practice approval and patient feedback."
  ],
  [
    "reed-diffuser-vs-commercial-diffusion-for-clinic-reception",
    "Reed Diffuser vs Commercial Diffusion for Clinic Reception",
    "hume-pro-commercial-tower",
    "Reeds",
    "Commercial diffusion",
    "A local passive impression cannot guarantee a large reception's coverage.",
    "Review the actual model, approved zone and supported settings rather than assume whole-clinic reach."
  ],
  [
    "room-spray-vs-automatic-scent-diffuser-for-clinics",
    "Room Spray vs Automatic Scent Diffuser for Clinics",
    "hume-commercial-scent-machine-pro",
    "Room spray",
    "Automatic diffuser",
    "Requires product-specific handling and staff timing; avoid application around patients.",
    "Schedules can repeat an approved routine but do not assess patient comfort or eliminate refills."
  ],
  [
    "aerosol-air-freshener-vs-commercial-fragrance-diffuser-clinics",
    "Aerosol Air Freshener vs Commercial Fragrance Diffuser",
    "hume-commercial-scent-machine-pro",
    "Aerosol format",
    "Commercial fragrance diffuser",
    "Compare actual aerosol refills, dispensing instructions and practice permission.",
    "Compare approved oil, supported operation and ongoing staff checks under the same reception brief."
  ],
  [
    "automatic-aerosol-dispenser-vs-cold-air-scent-machine-clinics",
    "Automatic Aerosol Dispenser vs Cold-Air Scent Machine",
    "hume-commercial-scent-machine-pro",
    "Aerosol dispenser",
    "Cold-air machine",
    "Automation describes dispensing, not clinical approval or universal comfort.",
    "Approved-liquid atomization has its own controls and refill routine; no air-purification claim is made."
  ],
  [
    "fragrance-oil-diffuser-vs-essential-oil-diffuser-for-clinics",
    "Fragrance Oil Diffuser vs Essential Oil Diffuser for Clinics",
    "hume-commercial-scent-machine-pro",
    "Fragrance-oil device",
    "Essential-oil device",
    "Use the exact liquid approved for the selected machine.",
    "An essential-oil label does not establish approval for a fragrance machine or suitability for patients."
  ],
  [
    "essential-oils-vs-fragrance-oils-for-clinic-reception",
    "Essential Oils vs Fragrance Oils for Clinic Reception",
    "hume-commercial-scent-machine-pro",
    "Essential oils",
    "Fragrance oils",
    "Natural origin does not establish sensitivity-free use or a medical benefit.",
    "A composed formulation needs documentation, device approval and practice permission."
  ],
  [
    "signature-scent-vs-regular-air-freshener-for-clinics",
    "Signature Scent vs Regular Air Freshener for Clinics",
    "hume-pro-commercial-tower",
    "Signature brief",
    "Regular freshener",
    "Documents an optional brand composition and permitted zone rules.",
    "May describe a local product routine without formula rights or brand governance."
  ],
  [
    "signature-scent-vs-fragrance-free-clinic-reception",
    "Signature Scent vs Fragrance-Free Clinic Reception",
    "hume-commercial-scent-machine-pro",
    "Signature scent",
    "Fragrance-free reception",
    "Only an optional choice after practice permission and patient requirements are reviewed.",
    "A valid choice that requires no ambient fragrance purchase and may be required by practice policy."
  ],
  [
    "custom-clinic-fragrance-vs-ready-made-fragrance",
    "Custom Clinic Fragrance vs Ready-Made Fragrance",
    "hume-pro-commercial-tower",
    "Custom development",
    "Catalog concept",
    "Ask about confirmed availability, samples, ownership and production terms.",
    "Existing concepts still require stock, formulation, price and machine-pairing confirmation."
  ],
  [
    "one-signature-scent-vs-multiple-fragrances-across-a-clinic",
    "One Signature Scent vs Multiple Fragrances Across a Clinic",
    "hume-commercial-scent-machine-pro",
    "One composition",
    "Multiple compositions",
    "Can simplify supply but still requires explicit clinical exclusions.",
    "Needs approved air boundaries and overlap review; not a different fragrance for each clinical room."
  ],
  [
    "reception-only-scenting-vs-whole-clinic-scenting",
    "Reception-Only Scenting vs Whole-Clinic Scenting",
    "hume-commercial-scent-machine-pro",
    "Reception-only scope",
    "Whole-clinic scope",
    "Limited to an approved non-clinical hospitality zone with reviewed connected air paths.",
    "Outside the proposed plan: examination, procedure, treatment and recovery spaces remain excluded."
  ],
  [
    "standalone-diffuser-vs-hvac-scenting-for-clinics",
    "Standalone Diffuser vs HVAC Scenting for Clinics",
    "hume-commercial-scent-machine-pro",
    "Standalone",
    "HVAC distribution",
    "Local placement does not prove isolation from clinical rooms.",
    "Only consider qualified review of a separable non-clinical zone; decline where exclusions cannot be maintained."
  ],
  [
    "one-large-diffuser-vs-multiple-small-diffusers-clinics",
    "One Large Diffuser vs Multiple Small Diffusers",
    "800ml-commercial-diffuser",
    "One large device",
    "Multiple small devices",
    "Reservoir size does not guarantee greater reach or acceptable local intensity.",
    "Unit count is not total clinic area divided by nominal coverage; each approved zone needs review."
  ],
  [
    "electric-diffuser-vs-reed-diffuser-for-clinic-reception",
    "Electric Diffuser vs Reed Diffuser for Clinic Reception",
    "hume-commercial-scent-machine-pro",
    "Electric diffuser",
    "Passive reed",
    "Requires approved power, settings and servicing access for the exact model.",
    "Requires approved reed liquid and secure spill-conscious placement; no electronic schedule."
  ],
  [
    "waterless-diffuser-vs-reed-diffuser-for-clinics",
    "Waterless Diffuser vs Reed Diffuser for Clinics",
    "hume-commercial-scent-machine-pro",
    "Waterless machine",
    "Reed diffuser",
    "Uses model-approved liquid and supported operation without a water-refill routine.",
    "Provides passive local fragrance with its own approved liquid; it is not compatible by default with machine oil."
  ],
  [
    "wall-mounted-vs-desktop-clinic-diffuser",
    "Wall-Mounted vs Desktop Clinic Diffuser",
    "hume-commercial-scent-machine-pro",
    "Wall mounting",
    "Desktop placement",
    "Needs confirmed model approval, brackets and suitable hardware.",
    "Needs a secure approved surface away from patient routes and clinical supplies."
  ],
  [
    "wall-mounted-vs-floor-standing-clinic-diffuser",
    "Wall-Mounted vs Floor-Standing Clinic Diffuser",
    "hume-pro-commercial-tower",
    "Wall mounting",
    "Floor-standing",
    "Requires verified mounting approval; no HUME bracket inclusion is assumed.",
    "A tower requires secure dry placement outside patient routes and cleaning paths."
  ],
  [
    "portable-vs-fixed-clinic-scent-machine",
    "Portable vs Fixed Clinic Scent Machine",
    "hume-commercial-scent-machine-pro",
    "Movable placement",
    "Fixed installation",
    "Does not prove battery operation or permission to move a filled unit.",
    "Requires approved power, location and documented servicing access."
  ],
  [
    "small-vs-large-commercial-clinic-diffuser",
    "Small vs Large Commercial Clinic Diffuser",
    "800ml-commercial-diffuser",
    "Small format",
    "Large format",
    "Small housing does not establish a safe setting for every patient.",
    "Larger reservoir capacity does not establish whole-clinic coverage or clinical certification."
  ],
  [
    "400ml-vs-800ml-clinic-fragrance-machine",
    "400ml vs 800ml Clinic Fragrance Machine",
    "800ml-commercial-diffuser",
    "400ml HUME model",
    "800ml HUME model",
    "₹4,190; 400ml; listed 1,000–2,000 sq ft; Wi-Fi, Bluetooth and app controls.",
    "₹7,950; 800ml; listed up to 2,000 sq ft; the larger reservoir does not double coverage."
  ],
  [
    "500-sq-ft-vs-1-500-sq-ft-clinic-scent-machine",
    "500 Sq Ft vs 1,500 Sq Ft Clinic Scent Machine",
    "hume-commercial-scent-machine-pro",
    "500 sq ft brief",
    "1,500 sq ft brief",
    "Below the 400ml listed 1,000–2,000 sq ft range; request suitability review rather than assume a fit.",
    "Within an indicative local-format reference, but policy, height and air paths still determine suitability."
  ],
  [
    "reception-diffuser-vs-waiting-room-diffuser-placement",
    "Reception Diffuser vs Waiting-Room Diffuser Placement",
    "hume-commercial-scent-machine-pro",
    "Reception position",
    "Waiting-room position",
    "Review front-desk exposure, doors and adjacent clinical spaces.",
    "Patients may be unable to avoid exposure; waiting-room scent may be inappropriate under practice policy."
  ],
  [
    "continuous-vs-interval-fragrance-diffusion-for-clinics",
    "Continuous vs Interval Fragrance Diffusion for Clinics",
    "hume-commercial-scent-machine-pro",
    "Continuous operation",
    "Interval operation",
    "Confirm actual model support; maximum runtime is not automatically appropriate.",
    "Supported intervals can reduce runtime but no universal clinical duty cycle is supplied."
  ],
  [
    "very-low-vs-medium-intensity-clinic-scenting",
    "Very-Low vs Medium-Intensity Clinic Scenting",
    "hume-commercial-scent-machine-pro",
    "Very-low setting",
    "Medium setting",
    "Low intensity is not a universal safety threshold or sensitivity-free guarantee.",
    "A higher setting is not automatically a better experience; practice policy may require no scent."
  ],
  [
    "manual-air-freshening-vs-automated-clinic-scenting",
    "Manual Air Freshening vs Automated Clinic Scenting",
    "hume-commercial-scent-machine-pro",
    "Manual freshening",
    "Automated routine",
    "Depends on staff application and product instructions; do not mask clinical source concerns.",
    "Supported schedules still require refills, permission, feedback review and shutdown responsibility."
  ],
  [
    "timer-controlled-vs-app-controlled-clinic-diffuser",
    "Timer-Controlled vs App-Controlled Clinic Diffuser",
    "hume-commercial-scent-machine-pro",
    "Timer control",
    "App control",
    "Confirm documented schedules and who can stop the device.",
    "Confirm app requirements and supported settings; remote cloud access is not assumed."
  ],
  [
    "bluetooth-vs-wi-fi-clinic-fragrance-machine",
    "Bluetooth vs Wi-Fi Clinic Fragrance Machine",
    "hume-commercial-scent-machine-pro",
    "Bluetooth",
    "Wi-Fi",
    "Confirm the supported app and device connection requirements.",
    "400ml and 800ml list Wi-Fi; this does not prove a central fleet dashboard or autonomous intensity control."
  ],
  [
    "water-based-vs-oil-based-clinic-scent-systems",
    "Water-Based vs Oil-Based Clinic Scent Systems",
    "hume-commercial-scent-machine-pro",
    "Water-based format",
    "Oil-based format",
    "Follow the exact water, consumable and cleaning routine.",
    "Use the exact approved formulation; an oil label does not establish sensitivity-free operation."
  ],
  [
    "alcohol-based-room-spray-vs-oil-diffusion-for-clinics",
    "Alcohol-Based Room Spray vs Oil Diffusion for Clinics",
    "hume-commercial-scent-machine-pro",
    "Alcohol-based spray",
    "Oil diffusion",
    "Review actual formulation and handling instructions; do not apply around patients.",
    "Machine oil is device-specific and is not a substitute spray or clinical chemical control."
  ],
  [
    "essential-oil-scenting-vs-fine-fragrance-scenting-for-clinics",
    "Essential-Oil Scenting vs Fine-Fragrance Scenting for Clinics",
    "hume-commercial-scent-machine-pro",
    "Essential-oil direction",
    "Fine-fragrance direction",
    "Material origin alone does not establish patient suitability or therapeutic benefit.",
    "A composed fragrance is optional and requires exact approval; preferences and policy take priority."
  ],
  [
    "white-tea-vs-citrus-fragrance-for-aesthetic-clinics",
    "White Tea vs Citrus Fragrance for Aesthetic Clinics",
    "hume-pro-commercial-tower",
    "White tea direction",
    "Citrus direction",
    "Ivory Lobby lists white tea within bergamot and cedar; sample the complete composition only if permitted.",
    "The same concept lists bergamot; overlapping notes do not establish two separate confirmed products."
  ],
  [
    "bergamot-vs-green-tea-fragrance-for-clinic-reception",
    "Bergamot vs Green Tea Fragrance for Clinic Reception",
    "hume-pro-commercial-tower",
    "Bergamot direction",
    "Green tea direction",
    "Bergamot is listed in Ivory Lobby with white tea and cedar.",
    "Green tea is not a confirmed catalog note; white tea and black tea concepts do not prove its availability."
  ],
  [
    "floral-vs-fresh-fragrance-for-aesthetic-clinics",
    "Floral vs Fresh Fragrance for Aesthetic Clinics",
    "hume-pro-commercial-tower",
    "Floral direction",
    "Fresh direction",
    "Neroli in Verdant Courtyard or iris in Santal Residence are listed notes, not a universal patient preference.",
    "Coastal Gallery is a mineral-air concept; fresh describes aroma, not cleaner air or disinfection."
  ],
  [
    "woody-vs-clean-fragrance-for-premium-clinics",
    "Woody vs Clean Fragrance for Premium Clinics",
    "hume-pro-commercial-tower",
    "Woody direction",
    "Clean direction",
    "Compare Santal Residence or Quiet Library as whole concepts where policy permits.",
    "Clean is a sensory description, not infection control; no clean-musk note is confirmed."
  ],
  [
    "musk-vs-white-tea-fragrance-for-dermatology-clinics",
    "Musk vs White Tea Fragrance for Dermatology Clinics",
    "hume-pro-commercial-tower",
    "Musk direction",
    "White tea direction",
    "Musk is not a confirmed HUME catalog note; request availability and exact formulation.",
    "Ivory Lobby lists white tea, bergamot and cedar; no calming or clinical benefit is promised."
  ],
  [
    "signature-scenting-vs-odour-neutralisation-for-clinics",
    "Signature Scenting vs Odour Neutralisation for Clinics",
    "hume-commercial-scent-machine-pro",
    "Signature fragrance",
    "Source-odour treatment",
    "An optional hospitality identity cue for an approved zone.",
    "Investigate sources separately; HUME fragrance equipment is not claimed to neutralise odours or repair ventilation."
  ],
  [
    "clinic-scent-marketing-vs-traditional-air-freshening",
    "Clinic Scent Marketing vs Traditional Air Freshening",
    "hume-commercial-scent-machine-pro",
    "Brand-led ambience",
    "Air-freshening routine",
    "Defines an optional composition, exclusions and governance.",
    "May focus on a local aroma impression; neither replaces cleaning or clinical air controls."
  ],
  [
    "reception-scenting-vs-full-facility-scenting",
    "Reception Scenting vs Full-Facility Scenting",
    "hume-commercial-scent-machine-pro",
    "Reception scope",
    "Full facility scope",
    "An approved non-clinical arrival plan with explicit unscented exclusions.",
    "Not permission to scent examination, procedure, treatment or recovery areas or shared clinical air."
  ],
  [
    "buying-vs-renting-a-clinic-scent-machine",
    "Buying vs Renting a Clinic Scent Machine",
    "800ml-commercial-diffuser",
    "Purchase",
    "Rental",
    "Catalog prices are equipment purchase references; inclusions need written confirmation.",
    "Not a confirmed HUME standard offer; ask about availability, ownership, term and total charges."
  ],
  [
    "in-house-scenting-vs-managed-clinic-scenting-service",
    "In-House Scenting vs Managed Clinic Scenting Service",
    "800ml-commercial-diffuser",
    "In-house routine",
    "Managed service",
    "Names authorised staff for supported settings, checks and refills.",
    "Requires confirmed availability, visit frequency, responsibilities and costs; not an assumed package."
  ],
  [
    "local-scent-supplier-vs-international-scent-company-clinics",
    "Local Scent Supplier vs International Scent Company",
    "hume-commercial-scent-machine-pro",
    "Local supplier",
    "International company",
    "Confirm actual city delivery and onsite availability; no nearby HUME branch is assumed.",
    "Company scale does not prove better fit; compare documented scope, support and recurring costs."
  ],
  [
    "custom-signature-scent-vs-designer-inspired-scent-for-clinics",
    "Custom Signature Scent vs Designer-Inspired Scent for Clinics",
    "hume-pro-commercial-tower",
    "Custom original brief",
    "Designer-inspired direction",
    "Needs confirmed development availability, formula rights and supply terms.",
    "Does not prove affiliation, exact replication or rights to another brand's formula."
  ],
  [
    "commercial-clinic-scenting-cost-vs-traditional-air-freshening-cost",
    "Commercial Clinic Scenting Cost vs Traditional Air-Freshening Cost",
    "hume-commercial-scent-machine-pro",
    "Machine plan",
    "Existing routine",
    "Include hardware, approved oil, measured consumption, maintenance and staff checks.",
    "Compare actual consumables and staff time over the same period; savings and patient outcomes are not guaranteed."
  ]
];
export const clinicComparisonPages=briefs.map(([slug,title,product,left,right,leftAdvice,rightAdvice])=>({slug,title,product,left,right,description:leftAdvice+' '+rightAdvice,rows:[['What to evaluate',leftAdvice,rightAdvice],['Practice approval','Review the same approved non-clinical zone and clinical exclusions.','Review the same practice policy and patient requirements; no scent is valid.'],['Costs and responsibilities','Request written equipment, liquid, servicing and staff assumptions.','Compare the same period, operating hours and included scope.']] as [string,string,string][],sections:[['When to consider '+left,leftAdvice+' Assess the actual hospitality zone and practice policy.'],['When to consider '+right,rightAdvice+' Ask for exact specifications rather than choose by the category label.'],['Make a like-for-like decision','For '+title+', compare the same approved zone, height, air paths, hours, patient requirements and exclusions. Keep examination, procedure, treatment and recovery areas outside the scenting plan. No universal winner, sensitivity-free formula or independently tested clinical ranking is claimed.'],['Review any optional HUME proposal','The featured model is an enquiry starting point only if an appropriate non-clinical zone is approved. '+leftAdvice+' '+rightAdvice+' Confirm stock, GST, delivery, exact liquid approval and support scope. Fragrance-free operation may be the right decision; no infection-control, treatment or air-purification benefit is claimed.']] as Pair[],questions:[['Which option should the practice consider?',leftAdvice+' '+rightAdvice],['Does this comparison guarantee patient comfort or savings?','No. Follow practice policy and patient requirements; no universal safe setting or clinical benefit is claimed. Compare actual written costs rather than assume savings.'],['Where should fragrance not be used?','Keep examination, procedure, treatment and recovery spaces outside the plan, along with any fragrance-free room, route or connected air zone identified by the practice.'],['What should I send for a proposal?','Send approved hospitality zone area, heights, air paths, operating hours, clinical exclusions and practice policy. Do not share private patient information.'],['Are custom development, rental and managed visits included?','No such inclusion is assumed. Ask about availability, samples, rights, quantities, visits and written commercial terms for the requested scope.']] as Pair[]}));
export const clinicComparisonClusters=[{title:'Formats, liquids and fragrance-free choices',start:0,end:16},{title:'Scope, placement and equipment size',start:16,end:29},{title:'Controls and fragrance directions',start:29,end:42},{title:'Source treatment, services and total costs',start:42,end:50}];
