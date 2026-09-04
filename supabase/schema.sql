create extension if not exists "pgcrypto";

create table if not exists public.issues (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  district text not null,
  town text not null,
  description text not null,
  severity text not null check (severity in ('low', 'medium', 'high')),
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'resolved')),
  image_url text,
  created_at timestamptz not null default now()
);

create index if not exists issues_created_at_idx
  on public.issues (created_at desc);

create index if not exists issues_category_idx
  on public.issues (category);

create index if not exists issues_district_idx
  on public.issues (district);

create index if not exists issues_severity_idx
  on public.issues (severity);
