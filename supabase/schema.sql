-- ==============================================================================
-- SitePulse Database Schema (Phase 1 & Phase 2)
-- ==============================================================================

-- 1. Profiles Table (Extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text,
  plan text not null default 'free' check (plan in ('free', 'starter', 'pro')),
  paddle_customer_id text,
  paddle_subscription_id text,
  agency_name text default 'My Web Studio',
  agency_tagline text default 'Website Maintenance & SEO Audits',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Monitored Sites Table
create table if not exists public.monitored_sites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  domain text not null,
  url text not null,
  overall_score integer not null default 85,
  speed_score integer not null default 80,
  seo_score integer not null default 85,
  sec_score integer not null default 90,
  last_checked timestamp with time zone default timezone('utc'::text, now()),
  status text not null default 'healthy' check (status in ('healthy', 'warning', 'critical')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.monitored_sites enable row level security;

-- Profiles Security Policies
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Monitored Sites Security Policies
drop policy if exists "Users can view own monitored sites" on public.monitored_sites;
create policy "Users can view own monitored sites" on public.monitored_sites
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own monitored sites" on public.monitored_sites;
create policy "Users can insert own monitored sites" on public.monitored_sites
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own monitored sites" on public.monitored_sites;
create policy "Users can update own monitored sites" on public.monitored_sites
  for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own monitored sites" on public.monitored_sites;
create policy "Users can delete own monitored sites" on public.monitored_sites
  for delete using (auth.uid() = user_id);

-- 4. Trigger to automatically create a profile when a user registers
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, plan)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'free'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
