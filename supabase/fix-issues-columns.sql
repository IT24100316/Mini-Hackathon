alter table public.issues
  add column if not exists title text,
  add column if not exists category text,
  add column if not exists district text,
  add column if not exists town text,
  add column if not exists description text,
  add column if not exists severity text,
  add column if not exists status text default 'pending',
  add column if not exists image_url text,
  add column if not exists created_at timestamptz default now();

update public.issues
set
  title = coalesce(title, concat(coalesce(category, 'Issue'), ' in ', coalesce(town, 'Unknown'))),
  category = coalesce(category, 'Other'),
  district = coalesce(district, 'Unknown'),
  town = coalesce(town, 'Unknown'),
  description = coalesce(description, 'No description provided.'),
  severity = coalesce(severity, 'low'),
  status = coalesce(status, 'pending'),
  created_at = coalesce(created_at, now());

alter table public.issues
  alter column title set not null,
  alter column category set not null,
  alter column district set not null,
  alter column town set not null,
  alter column description set not null,
  alter column severity set not null,
  alter column status set not null,
  alter column created_at set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'issues_severity_check'
      and conrelid = 'public.issues'::regclass
  ) then
    alter table public.issues
      add constraint issues_severity_check
      check (severity in ('low', 'medium', 'high'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'issues_status_check'
      and conrelid = 'public.issues'::regclass
  ) then
    alter table public.issues
      add constraint issues_status_check
      check (status in ('pending', 'in_progress', 'resolved'));
  end if;
end $$;

create index if not exists issues_created_at_idx
  on public.issues (created_at desc);

create index if not exists issues_category_idx
  on public.issues (category);

create index if not exists issues_district_idx
  on public.issues (district);

create index if not exists issues_severity_idx
  on public.issues (severity);

notify pgrst, 'reload schema';
