-- Landing: opdater overskrift i produkt/pricing-sektionen.
-- Kør i Supabase SQL Editor. Idempotent (on conflict do update).

insert into public.ui_translations (translation_key, language_code, text_value, context_description) values
('landing.plans.header.title', 'en-US', 'Pricing', 'Pricing section headline.'),
('landing.plans.header.title', 'en-IE', 'Pricing', 'Pricing section headline.'),
('landing.plans.header.title', 'da', 'Priser', 'Overskrift i produkt/pricing-sektionen.')
on conflict (translation_key, language_code) do update set
  text_value = excluded.text_value,
  context_description = excluded.context_description;
