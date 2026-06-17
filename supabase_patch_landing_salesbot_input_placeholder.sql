-- SalesBot: chat input placeholder per language (not static English).
-- Kør i Supabase SQL Editor. Idempotent (on conflict do update).

insert into public.ui_translations (translation_key, language_code, text_value, context_description) values
('landing.salesbot.input_placeholder', 'en-US', 'Ask me anything about BOB', 'Placeholder in SalesBot chat input field.'),
('landing.salesbot.input_placeholder', 'en-IE', 'Ask me anything about BOB', 'Placeholder in SalesBot chat input field.'),
('landing.salesbot.input_placeholder', 'da', 'Spørg mig om alt vedrørende BOB', 'Placeholder i SalesBot chat-inputfeltet.'),
('landing.salesbot.input_placeholder', 'de', 'Frag mich alles über BOB', 'Placeholder in SalesBot chat input field.'),
('landing.salesbot.input_placeholder', 'de-AT', 'Frag mich alles über BOB', 'Placeholder in SalesBot chat input field.'),
('landing.salesbot.input_placeholder', 'nl', 'Vraag me alles over BOB', 'Placeholder in SalesBot chat input field.'),
('landing.salesbot.input_placeholder', 'nl-BE', 'Vraag me alles over BOB', 'Placeholder in SalesBot chat input field.'),
('landing.salesbot.input_placeholder', 'sv', 'Fråga mig vad som helst om BOB', 'Placeholder in SalesBot chat input field.'),
('landing.salesbot.input_placeholder', 'fi', 'Kysy minulta mitä vain BOB:sta', 'Placeholder in SalesBot chat input field.'),
('landing.salesbot.input_placeholder', 'fr', 'Demandez-moi tout sur BOB', 'Placeholder in SalesBot chat input field.'),
('landing.salesbot.input_placeholder', 'es', 'Pregúntame lo que quieras sobre BOB', 'Placeholder in SalesBot chat input field.'),
('landing.salesbot.input_placeholder', 'it', 'Chiedimi qualsiasi cosa su BOB', 'Placeholder in SalesBot chat input field.'),
('landing.salesbot.input_placeholder', 'pt', 'Pergunte-me qualquer coisa sobre o BOB', 'Placeholder in SalesBot chat input field.'),
('landing.salesbot.input_placeholder', 'pl', 'Zapytaj mnie o cokolwiek dotyczące BOB', 'Placeholder in SalesBot chat input field.'),
('landing.salesbot.input_placeholder', 'cs', 'Zeptejte se mě na cokoli ohledně BOB', 'Placeholder in SalesBot chat input field.'),
('landing.salesbot.input_placeholder', 'sk', 'Opýtajte sa ma na čokoľvek o BOB', 'Placeholder in SalesBot chat input field.'),
('landing.salesbot.input_placeholder', 'hu', 'Kérdezz bármit a BOB-ról', 'Placeholder in SalesBot chat input field.'),
('landing.salesbot.input_placeholder', 'ro', 'Întreabă-mă orice despre BOB', 'Placeholder in SalesBot chat input field.'),
('landing.salesbot.input_placeholder', 'bg', 'Попитай ме за всичко относно BOB', 'Placeholder in SalesBot chat input field.'),
('landing.salesbot.input_placeholder', 'hr', 'Pitaj me bilo što o BOB-u', 'Placeholder in SalesBot chat input field.'),
('landing.salesbot.input_placeholder', 'sl', 'Vprašaj me karkoli o BOB', 'Placeholder in SalesBot chat input field.'),
('landing.salesbot.input_placeholder', 'et', 'Küsi minult kõike BOBi kohta', 'Placeholder in SalesBot chat input field.'),
('landing.salesbot.input_placeholder', 'lv', 'Jautā man jebko par BOB', 'Placeholder in SalesBot chat input field.'),
('landing.salesbot.input_placeholder', 'lt', 'Klausk manęs bet ko apie BOB', 'Placeholder in SalesBot chat input field.'),
('landing.salesbot.input_placeholder', 'el', 'Ρώτησέ με οτιδήποτε για το BOB', 'Placeholder in SalesBot chat input field.'),
('landing.salesbot.input_placeholder', 'lb', 'Frot mech alles iwwer BOB', 'Placeholder in SalesBot chat input field.'),
('landing.salesbot.input_placeholder', 'mt', 'Staqsini dwar BOB', 'Placeholder in SalesBot chat input field.')
on conflict (translation_key, language_code) do update set
  text_value = excluded.text_value,
  context_description = excluded.context_description;
