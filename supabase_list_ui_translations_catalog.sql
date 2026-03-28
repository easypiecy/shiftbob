-- ShiftBob: Katalog over alle UI-oversættelser i databasen
--
-- Supabase SQL Editor: kør KUN ÉN query ad gangen (marker fra "select" ned til semikolon og kør).
-- Hvis du kører flere "select" i ét hug uden at markere korrekt, eller kun kommentarer,
-- kan du få: ERROR 42601 syntax error at end of input LINE 0.
--
-- Kør EFTER du har kørt:
--   1) supabase_i18n_setup.sql
--   2) supabase_seed_ui_translations_app.sql
--
-- Tabel: public.ui_translations
-- Kolonner der skal oversættes / vedligeholdes:
--   translation_key      — stabil app-nøgle (fx calendar.member_editor.title_create)
--   language_code        — sprog (fx da, en-US) — FK til public.languages
--   text_value           — den viste tekst (kan indeholde pladsholdere som {name}, {detail})
--   context_description  — kort note til oversættere / Super Admin (ikke vist i UI)
--
-- Kilde til fuld seed (alle rækker med INSERT … ON CONFLICT):
--   • Login + roller (primært en-US): supabase_i18n_setup.sql (bund-insert)
--   • Resten af app (da + en-US):      supabase_seed_ui_translations_app.sql

-- Liste alle oversættelser (alle felter pr. række)
select
  translation_key,
  language_code,
  text_value,
  context_description
from public.ui_translations
order by translation_key asc, language_code asc;

/*
-- (Valgfrit) Kør separat: unikke nøgler
select distinct translation_key
from public.ui_translations
order by translation_key asc;

-- (Valgfrit) Kør separat: antal pr. sprog
select language_code, count(*) as antal
from public.ui_translations
group by language_code
order by language_code;
*/
