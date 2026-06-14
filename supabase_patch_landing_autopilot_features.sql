-- Autopilot plan feature bullets (feature6 + feature8).
-- Kør i Supabase SQL Editor. Idempotent (on conflict do update).

insert into public.ui_translations (translation_key, language_code, text_value, context_description) values
('landing.plans.autopilot.feature6', 'en-US', 'Time-calculation export (incl. API access)', 'Feature bullet 6 in Autopilot; includes payroll/time export and API access.'),
('landing.plans.autopilot.feature6', 'da', 'Eksport af timeberegninger (inkl. API-adgang)', 'Feature-punkt 6 i Autopilot; inkluderer timeeksport og API-adgang.'),
('landing.plans.autopilot.feature8', 'en-US', 'Customize with local rule setup', 'Autopilot feature: configure custom scheduling rules for warnings, automatic schedule generation, and local union or country-specific rules via AI assistance or JSON.'),
('landing.plans.autopilot.feature8', 'da', 'Tilpas med lokale regelopsætning', 'Autopilot-feature: opsæt egne regler i vagtplanen til advarsler, automatisk vagtplanlægning og lokale overenskomster/landeregler via AI eller JSON.')
on conflict (translation_key, language_code) do update set
  text_value = excluded.text_value,
  context_description = excluded.context_description;
