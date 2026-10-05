# Visual discovery refresh

The follow-up redesign replaces the long hero and text-heavy homepage with warm cream, sage and clay tones, rounded imagery, clear buttons and short explanations. Existing product and architectural assets are reused throughout; scenes are illustrative rather than client evidence.

## Working interactions

- Five application buttons change the scene, zoning guidance and planning links.
- Four format buttons change the equipment photo, capacity, coverage and detail/quote links.
- Six scent buttons change the inspiration scene, scent notes and enquiry link. The same explorer appears on the fragrance page.
- Four question buttons show short equipment, cost, installation and refill answers.
- Catalog filters show all formats, three scent machines or the reed diffuser.
- A three-step planner uses image buttons for application and buttons for layout and ventilation, with validated area/hours fields. Its brief carries into the consultation form. The completed brief receives focus, and motion respects the reduced-motion preference.

Reusable interactions are in `components/HomeExperience.tsx`, `components/EquipmentCatalog.tsx` and `components/Selector.tsx`. `app/refresh.css` provides the shared visual refresh after the original base styles. Existing routes and lead-delivery integration remain available.

## Validation

Browser checks exercised application, HVAC comparison, Quiet Library selection, cost answers, all three catalog filters and the full office planner-to-enquiry journey. An empty area correctly blocked continuation. The resulting enquiry preserved 1,800 sq ft, separate rooms, central HVAC and 12 hours/day. At 390 px, homepage, equipment, oils, selector, hotel detail, tower detail and guides had no horizontal overflow. Desktop and mobile screenshots were reviewed in `output/playwright/redesign-*.png`.

Product facts and scent availability remain qualified. The receiving quotation service is still unconnected; no new installation, support, price or subscription promise has been introduced. Review remains local only.

Final production build and TypeScript compilation passed; all five existing validation/delivery tests passed. All 22 content pages returned HTTP 200 against the rebuilt production server, including offices and gyms. The final local preview remains at `http://127.0.0.1:3100`.

## Naming and wording update

The public brand name is HUME Spaces, without an attribution tagline. Header, footer, homepage and metadata follow this naming. Page and section headings now directly describe their content or action, including “Choose your type of space”, “Compare scenting equipment”, “Choose a fragrance profile” and “Request a consultation or quotation”. Industry headings state the application directly. Planner steps name the information requested.

## Product-focused navigation

Fragrances and Products open image-based menus. Shop links to the independently accessible `/shop` catalog page. The mobile menu uses expandable categories, image previews, a prominent Shop card and secondary planning/help links. Menus close on navigation, outside clicks or Escape; desktop dropdowns close each other. The mobile panel scrolls within the viewport. Shop remains a quotation catalog; no checkout or unconfirmed prices were added. `components/Navigation.tsx` and `app/navigation.css` own the navigation.

## Simplified browsing
Homepage reduced to products, fragrances, space links and one help action. Shop and equipment use a single catalog. Fragrances display all six profiles as cards. Product details prioritize essentials and quotation, with technical information in native expandable sections.

## WhatsApp enquiries
All enquiries use the user-confirmed number +91 9559024822. Product, fragrance, guide and space buttons prefill their topic. Selector and consultation forms prepare the entered brief for WhatsApp. Messages remain unsent until the visitor sends them in WhatsApp.
