create extension if not exists "pgcrypto";

alter table public.issues
  add column if not exists id uuid default gen_random_uuid(),
  add column if not exists title text,
  add column if not exists description text,
  add column if not exists category text,
  add column if not exists district text,
  add column if not exists status text default 'pending',
  add column if not exists created_at timestamptz default now();

update public.issues
set
  title = coalesce(title, concat(coalesce(category, 'Issue'), ' in ', coalesce(town, district, 'Unknown'))),
  description = coalesce(description, 'No description provided.'),
  category = coalesce(category, 'Other'),
  district = coalesce(district, 'Unknown'),
  status = coalesce(status, 'pending'),
  created_at = coalesce(created_at, now());

alter table public.issues
  alter column id set not null,
  alter column title set not null,
  alter column description set not null,
  alter column category set not null,
  alter column district set not null,
  alter column status set default 'pending',
  alter column status set not null,
  alter column created_at set default now(),
  alter column created_at set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'issues_status_check'
      and conrelid = 'public.issues'::regclass
  ) then
    alter table public.issues
      add constraint issues_status_check
      check (status in ('pending', 'in_progress', 'resolved', 'closed'));
  else
    alter table public.issues drop constraint issues_status_check;
    alter table public.issues
      add constraint issues_status_check
      check (status in ('pending', 'in_progress', 'resolved', 'closed'));
  end if;
end $$;

create index if not exists issues_created_at_idx
  on public.issues (created_at desc);

create index if not exists issues_status_idx
  on public.issues (status);

alter table public.issues enable row level security;

drop policy if exists "Public users can submit complaints" on public.issues;
drop policy if exists "Admin users can view complaints" on public.issues;
drop policy if exists "Admin users can update complaint status" on public.issues;

create policy "Public users can submit complaints"
  on public.issues
  for insert
  to anon, authenticated
  with check (status = 'pending');

create policy "Admin users can view complaints"
  on public.issues
  for select
  to authenticated
  using (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    or coalesce(auth.jwt() -> 'app_metadata' ->> 'user_role', auth.jwt() -> 'user_metadata' ->> 'user_role') = 'admin'
  );

create policy "Admin users can update complaint status"
  on public.issues
  for update
  to authenticated
  using (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    or coalesce(auth.jwt() -> 'app_metadata' ->> 'user_role', auth.jwt() -> 'user_metadata' ->> 'user_role') = 'admin'
  )
  with check (
    (
      coalesce(auth.jwt() -> 'app_metadata' ->> 'role', auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
      or coalesce(auth.jwt() -> 'app_metadata' ->> 'user_role', auth.jwt() -> 'user_metadata' ->> 'user_role') = 'admin'
    )
    and status in ('pending', 'in_progress', 'resolved', 'closed')
  );

notify pgrst, 'reload schema';
