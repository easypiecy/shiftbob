-- Vis UK-engelsk i stedet for English (Ireland) i sproglisten (kode forbliver en-IE).

UPDATE public.languages
SET name = 'English (United Kingdom)'
WHERE language_code = 'en-IE';
