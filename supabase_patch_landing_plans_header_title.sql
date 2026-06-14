-- Landing: opdater overskrift i produkt/pricing-sektionen.
-- Kør i Supabase SQL Editor. Idempotent (on conflict do update).

insert into public.ui_translations (translation_key, language_code, text_value, context_description) values
('landing.plans.header.title', 'en-US', 'From your spreadsheet straight to your team''s smartphones.', 'Pricing section headline emphasizing the path from spreadsheet to employee smartphones.'),
('landing.plans.header.title', 'da', 'Fra dit regneark direkte til teamets smartphones.', 'Overskrift i produktsektionen om vejen fra regneark til medarbejdernes smartphones.')
on conflict (translation_key, language_code) do update set
  text_value = excluded.text_value,
  context_description = excluded.context_description;
