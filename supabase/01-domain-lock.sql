-- Reject any signup that isn't a @secretninjas.nl address.
-- Run once in Supabase dashboard -> SQL Editor.
create or replace function public.enforce_email_domain()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if lower(new.email) not like '%@secretninjas.nl' then
    raise exception 'Only @secretninjas.nl accounts are allowed';
  end if;
  return new;
end;
$$;

create trigger enforce_email_domain
before insert on auth.users
for each row execute function public.enforce_email_domain();
