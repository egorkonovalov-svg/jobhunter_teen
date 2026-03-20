-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- profiles (extends auth.users)
create table profiles (
  id uuid references auth.users primary key,
  role text check (role in ('teen', 'employer')) not null,
  name text not null,
  city text,
  company_name text,
  created_at timestamptz default now()
);

-- jobs
create table jobs (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid references profiles(id) on delete cascade,
  title text not null,
  company text not null,
  city text not null,
  category text not null,
  type text check (type in ('internship', 'part-time', 'gig')) not null,
  salary_min int,
  salary_max int,
  description text not null,
  contact_info text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- RLS
alter table profiles enable row level security;
alter table jobs enable row level security;

-- Anyone can read active jobs
create policy "Public read jobs" on jobs for select using (is_active = true);

-- Employers can insert/update/delete their own jobs
create policy "Employer owns jobs" on jobs for all
  using (employer_id = auth.uid());

-- Users can read/write their own profile
create policy "Own profile" on profiles for all
  using (id = auth.uid());

-- Trigger: auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'teen'),
    coalesce(new.raw_user_meta_data->>'name', new.email)
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
