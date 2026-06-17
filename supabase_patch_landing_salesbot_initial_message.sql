-- SalesBot: kortere første assistentbesked (undgår overlap med input-placeholder).
-- Kør i Supabase SQL Editor. Idempotent (on conflict do update).

insert into public.ui_translations (translation_key, language_code, text_value, context_description) values
('landing.salesbot.initial_message', 'en-US', 'Do you have any questions for me?', 'First assistant message when opening SalesBot chat — short friendly question.'),
('landing.salesbot.initial_message', 'en-IE', 'Do you have any questions for me?', 'First assistant message when opening SalesBot chat — short friendly question.'),
('landing.salesbot.initial_message', 'da', 'Har du nogle spørgsmål til mig?', 'Første assistentbesked når SalesBot-chatten åbnes — kort venligt spørgsmål.'),
('landing.salesbot.initial_message', 'de', 'Hast du Fragen an mich?', 'First assistant message when opening SalesBot chat — short friendly question.'),
('landing.salesbot.initial_message', 'de-AT', 'Hast du Fragen an mich?', 'First assistant message when opening SalesBot chat — short friendly question.'),
('landing.salesbot.initial_message', 'nl', 'Heb je vragen voor mij?', 'First assistant message when opening SalesBot chat — short friendly question.'),
('landing.salesbot.initial_message', 'nl-BE', 'Heb je vragen voor mij?', 'First assistant message when opening SalesBot chat — short friendly question.'),
('landing.salesbot.initial_message', 'sv', 'Har du några frågor till mig?', 'First assistant message when opening SalesBot chat — short friendly question.'),
('landing.salesbot.initial_message', 'fi', 'Onko sinulla kysymyksiä minulle?', 'First assistant message when opening SalesBot chat — short friendly question.'),
('landing.salesbot.initial_message', 'fr', 'Avez-vous des questions pour moi ?', 'First assistant message when opening SalesBot chat — short friendly question.'),
('landing.salesbot.initial_message', 'es', '¿Tienes alguna pregunta para mí?', 'First assistant message when opening SalesBot chat — short friendly question.'),
('landing.salesbot.initial_message', 'it', 'Hai delle domande per me?', 'First assistant message when opening SalesBot chat — short friendly question.'),
('landing.salesbot.initial_message', 'pt', 'Tem alguma pergunta para mim?', 'First assistant message when opening SalesBot chat — short friendly question.'),
('landing.salesbot.initial_message', 'pl', 'Masz do mnie jakieś pytania?', 'First assistant message when opening SalesBot chat — short friendly question.'),
('landing.salesbot.initial_message', 'cs', 'Máte pro mě nějaké otázky?', 'First assistant message when opening SalesBot chat — short friendly question.'),
('landing.salesbot.initial_message', 'sk', 'Máte pre mňa nejaké otázky?', 'First assistant message when opening SalesBot chat — short friendly question.'),
('landing.salesbot.initial_message', 'hu', 'Van kérdésed hozzám?', 'First assistant message when opening SalesBot chat — short friendly question.'),
('landing.salesbot.initial_message', 'ro', 'Ai întrebări pentru mine?', 'First assistant message when opening SalesBot chat — short friendly question.'),
('landing.salesbot.initial_message', 'bg', 'Имаш ли въпроси към мен?', 'First assistant message when opening SalesBot chat — short friendly question.'),
('landing.salesbot.initial_message', 'hr', 'Imate li pitanja za mene?', 'First assistant message when opening SalesBot chat — short friendly question.'),
('landing.salesbot.initial_message', 'sl', 'Imate kakšna vprašanja zame?', 'First assistant message when opening SalesBot chat — short friendly question.'),
('landing.salesbot.initial_message', 'et', 'Kas sul on mulle küsimusi?', 'First assistant message when opening SalesBot chat — short friendly question.'),
('landing.salesbot.initial_message', 'lv', 'Vai jums ir jautājumi man?', 'First assistant message when opening SalesBot chat — short friendly question.'),
('landing.salesbot.initial_message', 'lt', 'Ar turite man klausimų?', 'First assistant message when opening SalesBot chat — short friendly question.'),
('landing.salesbot.initial_message', 'el', 'Έχετε κάποια ερώτηση για μένα;', 'First assistant message when opening SalesBot chat — short friendly question.'),
('landing.salesbot.initial_message', 'lb', 'Hutt Dir Froen un mech?', 'First assistant message when opening SalesBot chat — short friendly question.'),
('landing.salesbot.initial_message', 'mt', 'Għandek xi mistoqsijiet għalija?', 'First assistant message when opening SalesBot chat — short friendly question.')
on conflict (translation_key, language_code) do update set
  text_value = excluded.text_value,
  context_description = excluded.context_description;
