-- Ret footer-firmanavn på landing (alle sprog) — skal altid være Whiff s.r.o.

UPDATE public.ui_translations
SET text_value = 'Whiff s.r.o. - Vlněna 5 - 602 00 Brno-střed - Czech Republic - support@shiftbob.io'
WHERE translation_key = 'landing.footer.company_line';
