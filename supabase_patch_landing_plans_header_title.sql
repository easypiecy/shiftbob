-- Landing: nulstil overskrift i produkt/pricing-sektionen (ét kort ord, fx "Price" / "Priser").
-- Retter fejl-AI-oversættelser (fx lang kapiteltekst i stedet for prisoverskrift).
-- Kør i Supabase SQL Editor. Idempotent (on conflict do update).

insert into public.ui_translations (translation_key, language_code, text_value, context_description) values
('landing.plans.header.title', 'en-US', 'Prices', 'Pricing section headline — one short word only (noun for prices/pricing).'),
('landing.plans.header.title', 'en-IE', 'Prices', 'Pricing section headline — one short word only (noun for prices/pricing).'),
('landing.plans.header.title', 'da', 'Priser', 'Overskrift i produkt/pricing-sektionen — ét kort ord.'),
('landing.plans.header.title', 'de', 'Preise', 'Pricing section headline — one short word only.'),
('landing.plans.header.title', 'de-AT', 'Preise', 'Pricing section headline — one short word only.'),
('landing.plans.header.title', 'nl', 'Prijzen', 'Pricing section headline — one short word only.'),
('landing.plans.header.title', 'nl-BE', 'Prijzen', 'Pricing section headline — one short word only.'),
('landing.plans.header.title', 'sv', 'Priser', 'Pricing section headline — one short word only.'),
('landing.plans.header.title', 'fi', 'Hinnat', 'Pricing section headline — one short word only.'),
('landing.plans.header.title', 'fr', 'Tarifs', 'Pricing section headline — one short word only.'),
('landing.plans.header.title', 'es', 'Precios', 'Pricing section headline — one short word only.'),
('landing.plans.header.title', 'it', 'Prezzi', 'Pricing section headline — one short word only.'),
('landing.plans.header.title', 'pt', 'Preços', 'Pricing section headline — one short word only.'),
('landing.plans.header.title', 'pl', 'Ceny', 'Pricing section headline — one short word only.'),
('landing.plans.header.title', 'cs', 'Ceník', 'Pricing section headline — one short word only.'),
('landing.plans.header.title', 'sk', 'Ceny', 'Pricing section headline — one short word only.'),
('landing.plans.header.title', 'hu', 'Árak', 'Pricing section headline — one short word only.'),
('landing.plans.header.title', 'ro', 'Prețuri', 'Pricing section headline — one short word only.'),
('landing.plans.header.title', 'bg', 'Цени', 'Pricing section headline — one short word only.'),
('landing.plans.header.title', 'hr', 'Cijene', 'Pricing section headline — one short word only.'),
('landing.plans.header.title', 'sl', 'Cene', 'Pricing section headline — one short word only.'),
('landing.plans.header.title', 'et', 'Hinnad', 'Pricing section headline — one short word only.'),
('landing.plans.header.title', 'lv', 'Cenas', 'Pricing section headline — one short word only.'),
('landing.plans.header.title', 'lt', 'Kainos', 'Pricing section headline — one short word only.'),
('landing.plans.header.title', 'el', 'Τιμές', 'Pricing section headline — one short word only.'),
('landing.plans.header.title', 'lb', 'Präisser', 'Pricing section headline — one short word only.'),
('landing.plans.header.title', 'mt', 'Prezzijiet', 'Pricing section headline — one short word only.')
on conflict (translation_key, language_code) do update set
  text_value = excluded.text_value,
  context_description = excluded.context_description;
