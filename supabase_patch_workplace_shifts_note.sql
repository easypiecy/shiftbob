-- Shift note for workplace_shifts (idempotent)

alter table public.workplace_shifts
  add column if not exists note text;
