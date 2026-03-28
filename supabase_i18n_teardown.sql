-- ShiftBob: Fjern i18n-objekter oprettet af supabase_i18n_setup.sql (tabeller + RLS forsvinder med tabellerne).
--
-- Kør KUN i den database hvor du ved en fejl har kørt i18n-setup / seeds, og som IKKE skal bruge oversættelser.
-- Tjek først at du er i det rigtige Supabase-projekt (Settings → General → Reference ID).
--
-- ADVARSEL: Hvis andre tabeller senere har fået foreign key til public.languages, fejler drop af languages
-- indtil den FK fjernes. I standard ShiftBob-SQL i dette repo peger intet andet på languages.
--
-- BEMÆRK: public.is_workplace_admin() fjernes IKKE her — den bruges også af RLS på andre tabeller,
-- hvis du har kørt workplaces/roller-setup i samme database. Slet ikke funktionen medmindre du ved,
-- at intet andet kalder den.

-- Rækkefølge: børn først (FK til languages).
drop table if exists public.ui_translations cascade;
drop table if exists public.eu_countries cascade;
drop table if exists public.languages cascade;

-- Valgfrit: kun hvis denne database ALDRIG skal bruge workplace-admin-checks fra i18n-filen,
-- og du er sikker på at ingen policies/triggers kalder funktionen:
-- drop function if exists public.is_workplace_admin();
