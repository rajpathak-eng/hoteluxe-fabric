-- Add items column for repeatable content blocks (stats, differentiators, cards, etc.)
ALTER TABLE public.page_sections 
ADD COLUMN IF NOT EXISTS items jsonb DEFAULT '[]'::jsonb;

-- Add a trust section for home page
INSERT INTO page_sections (page_slug, section_key, title, subtitle, content, display_order, is_active, items)
VALUES (
  'home',
  'trust',
  'Besueshmëri e provuar',
  'Numrat flasin',
  'Përvojë e gjatë dhe mijëra klientë të kënaqur në të gjithë rajonin dëshmojnë për cilësinë e produkteve dhe shërbimeve tona.',
  4,
  true,
  '[
    {"value": 10, "suffix": "+", "label": "Vite eksperiencë"},
    {"value": 500, "suffix": "+", "label": "Klientë të kënaqur"},
    {"value": 50, "suffix": "+", "label": "Bashkëpunime ndërkombëtare"},
    {"value": 100, "suffix": "%", "label": "Standarde profesionale"}
  ]'::jsonb
)
ON CONFLICT DO NOTHING;

-- Update differentiators section with items
UPDATE page_sections 
SET items = '[
  {"icon": "Award", "title": "Cilësi industriale hotelerie", "description": "Tekstile të certifikuara që plotësojnë standardet më të larta të industrisë së mikpritjes"},
  {"icon": "Wallet", "title": "Çmime konkurruese B2B", "description": "Ofrojmë çmime të favorshme për biznese me sasi të mëdha dhe bashkëpunime afatgjata"},
  {"icon": "Sparkles", "title": "Produkte të personalizuara", "description": "Mundësi loguara dhe personalizimi sipas kërkesave specifike të biznesit tuaj"},
  {"icon": "Clock", "title": "Eksperiencë 10+ vite", "description": "Dekada përvojë në furnizimin e hoteleve dhe objekteve të mikpritjes në rajon"}
]'::jsonb
WHERE page_slug = 'home' AND section_key = 'differentiators';

-- Add industries section with items
UPDATE page_sections
SET items = '[
  {"title": "Hotele", "description": "Tekstile premium për hotele nga 2 deri 5 yje me cilësi të lartë.", "href": "/sherbimet/tekstile-per-hotele", "image": "industry-hotel"},
  {"title": "Restorante", "description": "Mbulesa tavoline, peceta dhe tekstile kuzhine për çdo lloj restoranti.", "href": "/sherbimet/tekstile-per-restorante", "image": "industry-restaurant"},
  {"title": "Airbnb", "description": "Zgjidhje cilësore dhe ekonomike për apartamente turistike.", "href": "/sherbimet/tekstile-per-airbnb", "image": "industry-airbnb"},
  {"title": "Resorte", "description": "Tekstile luksoze për resorte bregdetare dhe malore.", "href": "/sherbimet/tekstile-per-resorte", "image": "industry-resort"},
  {"title": "Bujtina", "description": "Cilësi hotelerie për bujtina tradicionale dhe moderne.", "href": "/sherbimet/tekstile-per-bujtina", "image": "industry-guesthouse"},
  {"title": "SPA & Wellness", "description": "Peshqirë, batanije dhe tekstile relaksi për qendra wellness.", "href": "/sherbimet/tekstile-per-spa", "image": "industry-spa"}
]'::jsonb
WHERE page_slug = 'home' AND section_key = 'industries';

-- Reorder home page sections properly
UPDATE page_sections SET display_order = 1 WHERE page_slug = 'home' AND section_key = 'hero';
UPDATE page_sections SET display_order = 2 WHERE page_slug = 'home' AND section_key = 'differentiators';
UPDATE page_sections SET display_order = 3 WHERE page_slug = 'home' AND section_key = 'about';
UPDATE page_sections SET display_order = 4 WHERE page_slug = 'home' AND section_key = 'trust';
UPDATE page_sections SET display_order = 5 WHERE page_slug = 'home' AND section_key = 'products';
UPDATE page_sections SET display_order = 6 WHERE page_slug = 'home' AND section_key = 'industries';
UPDATE page_sections SET display_order = 7 WHERE page_slug = 'home' AND section_key = 'portfolio';
UPDATE page_sections SET display_order = 8 WHERE page_slug = 'home' AND section_key = 'contact';