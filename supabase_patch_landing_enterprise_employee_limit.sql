-- Landing enterprise callout + 100 employee limit copy.
-- Kør i Supabase SQL Editor. Idempotent (on conflict do update).

insert into public.ui_translations (translation_key, language_code, text_value, context_description) values
('landing.plans.employee_limit_footnote', 'en-US', '*Up to 100 employees', 'Subtle footnote on Hybrid App and Autopilot pricing cards.'),
('landing.plans.employee_limit_footnote', 'da', '*Op til 100 medarbejdere', 'Diskret fodnote på Hybrid App- og Autopilot-kort.'),
('landing.plans.enterprise.title', 'en-US', 'Enterprise Solution', 'Headline for enterprise callout below pricing cards on landing page.'),
('landing.plans.enterprise.title', 'da', 'Enterprise-løsning', 'Overskrift for enterprise-callout under produktkort på landing-siden.'),
('landing.plans.enterprise.subtitle', 'en-US', 'Managing a team of more than 100 employees? Contact us today for a tailored pricing agreement and custom onboarding.', 'Subheadline for enterprise callout on landing page.'),
('landing.plans.enterprise.subtitle', 'da', 'Har I et team på mere end 100 medarbejdere? Kontakt os i dag for en skræddersyet prisaftale og custom onboarding.', 'Underoverskrift for enterprise-callout på landing-siden.'),
('landing.plans.enterprise.cta', 'en-US', 'Contact Us', 'Primary button on enterprise callout; opens support ticket modal.'),
('landing.plans.enterprise.cta', 'da', 'Kontakt os', 'Primær knap på enterprise-callout; åbner support ticket-modal.'),
('employee_limit.exceeded_message', 'en-US', 'Wow, you have a great team! Your current plan supports up to 100 employees. Please contact us to upgrade to our Enterprise solution.', 'Modal message when Hybrid/Autopilot account exceeds 100 employees.'),
('employee_limit.exceeded_message', 'da', 'Wow, I har et fantastisk team! Jeres nuværende plan understøtter op til 100 medarbejdere. Kontakt os for at opgradere til vores Enterprise-løsning.', 'Modal-besked når Hybrid/Autopilot-konto overstiger 100 medarbejdere.'),
('common.close', 'en-US', 'Close', 'Generic close button label.'),
('common.close', 'da', 'Luk', 'Generisk luk-knaptekst.')
on conflict (translation_key, language_code) do update set
  text_value = excluded.text_value,
  context_description = excluded.context_description;
