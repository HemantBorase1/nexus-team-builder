-- Supabase schema for Nexus Team Builder (PostgreSQL)
-- Run in the SQL Editor in your Supabase project

-- Extensions
create extension if not exists pgcrypto;

-- 1) Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  faculty text,
  year int check (year between 1 and 8),
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;$$;

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated
before update on public.profiles
for each row execute procedure public.set_updated_at();

-- 2) Skills catalog
create table if not exists public.skills (
  id bigserial primary key,
  name text not null unique,
  category text,
  icon text,
  created_at timestamptz not null default now()
);

-- 3) User skills (many-to-many)
create table if not exists public.user_skills (
  user_id uuid not null references auth.users(id) on delete cascade,
  skill_id bigint not null references public.skills(id) on delete cascade,
  level smallint not null check (level between 1 and 5),
  created_at timestamptz not null default now(),
  primary key (user_id, skill_id)
);
create index if not exists idx_user_skills_skill_id on public.user_skills(skill_id);

-- 4) Availability (user time slots)
create table if not exists public.availability (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6), -- 0=Sun
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default now(),
  check (end_time > start_time)
);
create index if not exists idx_availability_user on public.availability(user_id);
create index if not exists idx_availability_day on public.availability(day_of_week);

-- 5) Projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text,
  description text,
  status text not null default 'Planning' check (status in ('Planning','Active','Completed')),
  team_size int check (team_size between 1 and 20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_projects_updated on public.projects;
create trigger trg_projects_updated
before update on public.projects
for each row execute procedure public.set_updated_at();

-- Project skill requirements
create table if not exists public.project_requirements (
  project_id uuid not null references public.projects(id) on delete cascade,
  skill_id bigint not null references public.skills(id) on delete cascade,
  required_level smallint not null check (required_level between 1 and 5),
  weight smallint not null default 1 check (weight between 1 and 10),
  primary key (project_id, skill_id)
);
create index if not exists idx_proj_req_skill on public.project_requirements(skill_id);

-- 6) Teams
create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_teams_project on public.teams(project_id);

-- 7) Team members (many-to-many between teams and users)
create table if not exists public.team_members (
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text,
  created_at timestamptz not null default now(),
  primary key (team_id, user_id)
);
create index if not exists idx_team_members_user on public.team_members(user_id);

-- 8) Invitations
create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  inviter_id uuid not null references auth.users(id) on delete cascade,
  invitee_id uuid references auth.users(id) on delete set null,
  invitee_email text,
  status text not null default 'pending' check (status in ('pending','accepted','declined','expired')),
  created_at timestamptz not null default now(),
  expires_at timestamptz
);
create index if not exists idx_invitations_invitee on public.invitations(invitee_id);
create index if not exists idx_invitations_team on public.invitations(team_id);

-- =========================
-- Row Level Security (RLS)
-- =========================
alter table public.profiles enable row level security;
alter table public.skills enable row level security;
alter table public.user_skills enable row level security;
alter table public.availability enable row level security;
alter table public.projects enable row level security;
alter table public.project_requirements enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.invitations enable row level security;

-- Profiles: anyone authenticated can read profiles, users can manage their own profile
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
for select using (true);

drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles
for insert with check (auth.uid() = id);

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

-- Skills: read for all; write restricted (e.g., admin role) - keep simple: no public writes
drop policy if exists skills_select on public.skills;
create policy skills_select on public.skills for select using (true);

-- User skills: users can manage their own skill links; everyone can read (optional)
drop policy if exists user_skills_select on public.user_skills;
create policy user_skills_select on public.user_skills for select using (true);
drop policy if exists user_skills_mutate on public.user_skills;
create policy user_skills_mutate on public.user_skills for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Availability: users manage their own; read allowed to authenticated users
drop policy if exists availability_select on public.availability;
create policy availability_select on public.availability for select using (true);
drop policy if exists availability_mutate on public.availability;
create policy availability_mutate on public.availability for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Projects: read all; only owner can mutate
drop policy if exists projects_select on public.projects;
create policy projects_select on public.projects for select using (true);
drop policy if exists projects_mutate on public.projects;
create policy projects_mutate on public.projects for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- Project requirements: read all; mutate only by project owner
drop policy if exists project_requirements_select on public.project_requirements;
create policy project_requirements_select on public.project_requirements for select using (true);
drop policy if exists project_requirements_mutate on public.project_requirements;
create policy project_requirements_mutate on public.project_requirements
for all using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()))
with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

-- Teams: read all; mutate only by project owner
drop policy if exists teams_select on public.teams;
create policy teams_select on public.teams for select using (true);
drop policy if exists teams_mutate on public.teams;
create policy teams_mutate on public.teams
for all using (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()))
with check (exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid()));

-- Team members: read all; add/remove only by project owner
drop policy if exists team_members_select on public.team_members;
create policy team_members_select on public.team_members for select using (true);
drop policy if exists team_members_mutate on public.team_members;
create policy team_members_mutate on public.team_members
for all using (
  exists (
    select 1 from public.teams t
    join public.projects p on p.id = t.project_id
    where t.id = team_id and p.owner_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.teams t
    join public.projects p on p.id = t.project_id
    where t.id = team_id and p.owner_id = auth.uid()
  )
);

-- Invitations: inviter or invitee can read; team owner can create; invitee or owner can update status
drop policy if exists invitations_select on public.invitations;
create policy invitations_select on public.invitations
for select using (
  auth.uid() = inviter_id OR auth.uid() = invitee_id OR exists (
    select 1 from public.teams t join public.projects p on p.id = t.project_id
    where t.id = team_id and p.owner_id = auth.uid()
  )
);

drop policy if exists invitations_insert on public.invitations;
create policy invitations_insert on public.invitations
for insert with check (
  exists (
    select 1 from public.teams t join public.projects p on p.id = t.project_id
    where t.id = team_id and p.owner_id = auth.uid()
  )
);

drop policy if exists invitations_update on public.invitations;
create policy invitations_update on public.invitations
for update using (
  auth.uid() = invitee_id OR auth.uid() = inviter_id OR exists (
    select 1 from public.teams t join public.projects p on p.id = t.project_id
    where t.id = team_id and p.owner_id = auth.uid()
  )
) with check (
  auth.uid() = invitee_id OR auth.uid() = inviter_id OR exists (
    select 1 from public.teams t join public.projects p on p.id = t.project_id
    where t.id = team_id and p.owner_id = auth.uid()
  )
);

-- =========================
-- Realtime publications
-- =========================
alter publication supabase_realtime add table
  public.profiles,
  public.user_skills,
  public.availability,
  public.projects,
  public.project_requirements,
  public.teams,
  public.team_members,
  public.invitations;


