-- Tables, RLS and profile trigger.
-- Run once in Supabase dashboard -> SQL Editor.

-- profiles: readable copy of the Google name/avatar (clients can't read auth.users)
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text,
  avatar_url text
);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- users that logged in before this trigger existed
insert into public.profiles (id, name, avatar_url)
select id, raw_user_meta_data ->> 'full_name', raw_user_meta_data ->> 'avatar_url'
from auth.users
on conflict do nothing;

-- attendance: a row means "will be at the office that day"
create table public.attendance (
  user_id uuid not null default auth.uid() references public.profiles on delete cascade,
  date date not null,
  primary key (user_id, date),
  constraint weekdays_only check (extract(isodow from date) <= 5)
);

alter table public.profiles enable row level security;
alter table public.attendance enable row level security;

create policy "profiles readable by members" on public.profiles
  for select to authenticated using (true);

create policy "attendance readable by members" on public.attendance
  for select to authenticated using (true);

-- own rows only, today or later (office time, not UTC)
create policy "attendance insert own, not past" on public.attendance
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and date >= (now() at time zone 'Europe/Amsterdam')::date
  );

create policy "attendance delete own, not past" on public.attendance
  for delete to authenticated
  using (
    user_id = auth.uid()
    and date >= (now() at time zone 'Europe/Amsterdam')::date
  );
