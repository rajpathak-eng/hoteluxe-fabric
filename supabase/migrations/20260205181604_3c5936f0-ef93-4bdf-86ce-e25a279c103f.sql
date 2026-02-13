-- Add certifications section to home page
INSERT INTO public.page_sections (page_slug, section_key, title, subtitle, display_order, is_active, items)
VALUES (
  'home',
  'certifications',
  'Certifikime & Partnerë',
  'Tekstile të certifikuara sipas standardeve ndërkombëtare',
  85,
  true,
  '[
    {"name": "OEKO-TEX Standard 100", "image": null},
    {"name": "WRAP", "image": null},
    {"name": "BSCI", "image": null},
    {"name": "GOTS - Organic Textile Standard", "image": null},
    {"name": "GRS - Recycled Blended", "image": null},
    {"name": "Sedex", "image": null},
    {"name": "Fire Resistant", "image": null}
  ]'::jsonb
);