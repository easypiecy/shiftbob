-- ShiftBob: Fjern notification_channel = 'none' og kolonnen push_send_none.
-- Kør i Supabase SQL Editor på eksisterende databaser (efter supabase_workplace_extended.sql).

update public.workplaces
set notification_channel = 'push'
where notification_channel is null
   or notification_channel = 'none';

alter table public.workplaces
  drop constraint if exists workplaces_notification_channel_check;

alter table public.workplaces
  add constraint workplaces_notification_channel_check
  check (notification_channel in ('push', 'sms'));

alter table public.workplaces
  alter column notification_channel set default 'push';

alter table public.workplaces
  drop column if exists push_send_none;
