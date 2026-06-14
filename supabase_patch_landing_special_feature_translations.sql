-- Landing: "Special feature" label + Autopilot "Employee chat" highlight.
-- Kør i Supabase SQL Editor. Idempotent (on conflict do update).

insert into public.ui_translations (translation_key, language_code, text_value, context_description) values
('landing.plans.special_feature_label', 'en-US', 'Special feature', 'Label used to visually highlight a standout plan feature.'),
('landing.plans.special_feature_label', 'da', 'Særlig funktion', 'Label der bruges til visuelt at fremhæve en særlig plan-feature.'),
('landing.plans.autopilot.special_feature_employee_chat', 'en-US', 'Employee chat', 'Special highlighted feature for the Autopilot plan.'),
('landing.plans.autopilot.special_feature_employee_chat', 'da', 'Medarbejderchat', 'Særligt fremhævet feature for Autopilot-planen.')
on conflict (translation_key, language_code) do update set
  text_value = excluded.text_value,
  context_description = excluded.context_description;
