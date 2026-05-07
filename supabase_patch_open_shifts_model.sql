-- ShiftBob patch: open shifts (ledig vagt) in workplace_shifts.
-- Safe to run multiple times.

alter table public.workplace_shifts
  alter column user_id drop not null;

alter table public.workplace_shifts
  add column if not exists required_employee_type_id uuid
    references public.workplace_employee_types (id) on delete set null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'workplace_shifts_open_requires_department'
      and conrelid = 'public.workplace_shifts'::regclass
  ) then
    alter table public.workplace_shifts
      add constraint workplace_shifts_open_requires_department
      check (user_id is not null or department_id is not null);
  end if;
end $$;

create index if not exists workplace_shifts_required_employee_type_idx
  on public.workplace_shifts (required_employee_type_id);
