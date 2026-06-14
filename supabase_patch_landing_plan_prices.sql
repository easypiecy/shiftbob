-- Normaliser landing-priser på tværs af alle sprog (flat EUR, uafhængigt af sprog).
-- Hybrid App: 49 EUR / month
-- Autopilot: 99 EUR / month

UPDATE public.ui_translations
SET text_value = '49 EUR'
WHERE translation_key = 'landing.plans.hybrid_app.price';

UPDATE public.ui_translations
SET text_value = '99 EUR'
WHERE translation_key = 'landing.plans.autopilot.price';

UPDATE public.ui_translations
SET text_value = '0 EUR'
WHERE translation_key = 'landing.plans.foundation.price';
