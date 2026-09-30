-- ====================================================================
-- IronFit Fitness Studio — Supabase Database Migration & RLS Security
-- Campaign: 30-Day Fitness Challenge
-- ====================================================================

-- 1. Create leads table
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  fitness_goal text not null,
  preferred_workout_time text not null,
  message text,
  status text not null default 'New',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. Create status check constraint to ensure only valid statuses
alter table public.leads
  drop constraint if exists check_lead_status;

alter table public.leads
  add constraint check_lead_status
  check (status in ('New', 'Contacted', 'Follow-up', 'Converted', 'Closed'));

-- 3. Create indexes for performance
create index if not exists idx_leads_created_at on public.leads (created_at desc);
create index if not exists idx_leads_status on public.leads (status);
create index if not exists idx_leads_fitness_goal on public.leads (fitness_goal);

-- 4. Enable Row Level Security (RLS)
alter table public.leads enable row level security;

-- 5. Security Policies:
-- 5a. Public visitors (anon) can only insert new leads
drop policy if exists "Allow public lead submissions" on public.leads;
create policy "Allow public lead submissions"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

-- 5b. Only authenticated users (admins) can view leads
drop policy if exists "Allow authenticated admin to view leads" on public.leads;
create policy "Allow authenticated admin to view leads"
  on public.leads
  for select
  to authenticated
  using (true);

-- 5c. Only authenticated users (admins) can update lead status
drop policy if exists "Allow authenticated admin to update leads" on public.leads;
create policy "Allow authenticated admin to update leads"
  on public.leads
  for update
  to authenticated
  using (true)
  with check (true);

-- 5d. Disallow deletions by default (leads should be preserved or marked Closed)
drop policy if exists "Disallow public deletions" on public.leads;
create policy "Disallow public deletions"
  on public.leads
  for delete
  to authenticated
  using (false);
