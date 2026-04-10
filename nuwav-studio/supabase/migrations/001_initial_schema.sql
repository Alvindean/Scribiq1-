-- NOTE: This project uses Neon (not Supabase). Apply these migrations via the Neon console or drizzle-kit.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Templates (defined before projects since projects references it)
create table templates (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text not null check (type in ('course', 'vsl', 'hybrid')),
  niche_category text,
  description text,
  structure jsonb not null,
  thumbnail_url text,
  is_public boolean default true,
  created_by uuid,
  created_at timestamptz default now()
);

-- Organizations (multi-tenant root)
create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  owner_id uuid references auth.users(id),
  plan text default 'starter' check (plan in ('starter', 'pro', 'agency', 'enterprise')),
  stripe_customer_id text,
  settings jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Users profile (extends Auth.js / Neon Auth)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid references organizations(id),
  email text not null,
  name text,
  role text default 'member' check (role in ('owner', 'admin', 'member', 'client')),
  avatar_url text,
  created_at timestamptz default now()
);

-- Add FK from templates to profiles after profiles is created
alter table templates add constraint templates_created_by_fkey
  foreign key (created_by) references profiles(id);

-- Projects
create table projects (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid references organizations(id) on delete cascade not null,
  created_by uuid references profiles(id),
  type text not null check (type in ('course', 'vsl', 'hybrid')),
  title text not null,
  niche text,
  target_audience text,
  tone text default 'professional',
  duration_target integer,
  template_id uuid references templates(id),
  status text default 'draft' check (status in ('draft', 'generating', 'review', 'published', 'archived')),
  brand_settings jsonb default '{"colors": {}, "fonts": {}, "logo_url": null}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Modules (course sections or VSL acts)
create table modules (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade not null,
  title text not null,
  "order" integer not null,
  type text default 'lesson' check (type in ('intro', 'lesson', 'cta', 'testimonial', 'bonus', 'outro')),
  created_at timestamptz default now()
);

-- Lessons (individual content units)
create table lessons (
  id uuid primary key default uuid_generate_v4(),
  module_id uuid references modules(id) on delete cascade not null,
  project_id uuid references projects(id) on delete cascade not null,
  title text not null,
  "order" integer not null,
  script text,
  slides jsonb default '[]',
  voiceover_url text,
  video_url text,
  thumbnail_url text,
  duration_seconds integer,
  status text default 'draft' check (status in ('draft', 'scripted', 'voiced', 'rendered', 'published')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Media assets
create table media_assets (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  lesson_id uuid references lessons(id) on delete set null,
  type text not null check (type in ('image', 'video', 'audio', 'pdf')),
  url text not null,
  storage_key text,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- Published pages
create table published_pages (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade not null,
  slug text unique not null,
  page_type text not null check (page_type in ('sales', 'checkout', 'course_portal', 'lesson')),
  content jsonb default '{}',
  custom_domain text,
  is_live boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Render jobs
create table render_jobs (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade not null,
  lesson_id uuid references lessons(id) on delete cascade,
  status text default 'queued' check (status in ('queued', 'rendering', 'complete', 'failed')),
  composition_id text,
  output_url text,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- Exports
create table exports (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade not null,
  format text not null check (format in ('mp4', 'pdf', 'pptx', 'scorm', 'zip')),
  url text,
  status text default 'pending' check (status in ('pending', 'processing', 'complete', 'failed')),
  created_at timestamptz default now()
);

-- RLS Policies
alter table organizations enable row level security;
alter table profiles enable row level security;
alter table projects enable row level security;
alter table modules enable row level security;
alter table lessons enable row level security;
alter table templates enable row level security;
alter table media_assets enable row level security;
alter table published_pages enable row level security;
alter table render_jobs enable row level security;
alter table exports enable row level security;

-- Profiles
create policy "Users can view own profile" on profiles for select using (id = auth.uid());
create policy "Users can update own profile" on profiles for update using (id = auth.uid());
create policy "Users can insert own profile" on profiles for insert with check (id = auth.uid());

-- Organizations
create policy "Users can view own org" on organizations for select
  using (id in (select org_id from profiles where id = auth.uid()));
create policy "Users can update own org" on organizations for update
  using (id in (select org_id from profiles where id = auth.uid()) and owner_id = auth.uid());

-- Projects
create policy "Users can view org projects" on projects for select
  using (org_id in (select org_id from profiles where id = auth.uid()));
create policy "Users can create org projects" on projects for insert
  with check (org_id in (select org_id from profiles where id = auth.uid()));
create policy "Users can update org projects" on projects for update
  using (org_id in (select org_id from profiles where id = auth.uid()));
create policy "Users can delete org projects" on projects for delete
  using (org_id in (select org_id from profiles where id = auth.uid()));

-- Modules
create policy "Users can view org modules" on modules for select
  using (project_id in (select id from projects where org_id in (select org_id from profiles where id = auth.uid())));
create policy "Users can create org modules" on modules for insert
  with check (project_id in (select id from projects where org_id in (select org_id from profiles where id = auth.uid())));
create policy "Users can update org modules" on modules for update
  using (project_id in (select id from projects where org_id in (select org_id from profiles where id = auth.uid())));
create policy "Users can delete org modules" on modules for delete
  using (project_id in (select id from projects where org_id in (select org_id from profiles where id = auth.uid())));

-- Lessons
create policy "Users can view org lessons" on lessons for select
  using (project_id in (select id from projects where org_id in (select org_id from profiles where id = auth.uid())));
create policy "Users can create org lessons" on lessons for insert
  with check (project_id in (select id from projects where org_id in (select org_id from profiles where id = auth.uid())));
create policy "Users can update org lessons" on lessons for update
  using (project_id in (select id from projects where org_id in (select org_id from profiles where id = auth.uid())));
create policy "Users can delete org lessons" on lessons for delete
  using (project_id in (select id from projects where org_id in (select org_id from profiles where id = auth.uid())));

-- Media assets
create policy "Users can view org media" on media_assets for select
  using (project_id in (select id from projects where org_id in (select org_id from profiles where id = auth.uid())));
create policy "Users can create org media" on media_assets for insert
  with check (project_id in (select id from projects where org_id in (select org_id from profiles where id = auth.uid())));
create policy "Users can delete org media" on media_assets for delete
  using (project_id in (select id from projects where org_id in (select org_id from profiles where id = auth.uid())));

-- Published pages
create policy "Public pages viewable by all" on published_pages for select
  using (is_live = true);
create policy "Org can manage own pages" on published_pages for all
  using (project_id in (select id from projects where org_id in (select org_id from profiles where id = auth.uid())));

-- Render jobs
create policy "Users can view org render jobs" on render_jobs for select
  using (project_id in (select id from projects where org_id in (select org_id from profiles where id = auth.uid())));
create policy "Users can create org render jobs" on render_jobs for insert
  with check (project_id in (select id from projects where org_id in (select org_id from profiles where id = auth.uid())));
create policy "Users can update org render jobs" on render_jobs for update
  using (project_id in (select id from projects where org_id in (select org_id from profiles where id = auth.uid())));

-- Exports
create policy "Users can view org exports" on exports for select
  using (project_id in (select id from projects where org_id in (select org_id from profiles where id = auth.uid())));
create policy "Users can create org exports" on exports for insert
  with check (project_id in (select id from projects where org_id in (select org_id from profiles where id = auth.uid())));

-- Templates
create policy "Public templates visible to all" on templates for select
  using (is_public = true);
create policy "Org templates visible to org" on templates for select
  using (created_by in (select id from profiles where org_id in (select org_id from profiles where id = auth.uid())));
create policy "Org can create templates" on templates for insert
  with check (created_by = auth.uid());

-- Indexes
create index idx_projects_org on projects(org_id);
create index idx_modules_project on modules(project_id);
create index idx_lessons_module on lessons(module_id);
create index idx_lessons_project on lessons(project_id);
create index idx_media_project on media_assets(project_id);
create index idx_render_jobs_project on render_jobs(project_id);
create index idx_published_pages_slug on published_pages(slug);

-- Trigger: update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_updated_at before update on projects
  for each row execute function update_updated_at();
create trigger lessons_updated_at before update on lessons
  for each row execute function update_updated_at();
create trigger published_pages_updated_at before update on published_pages
  for each row execute function update_updated_at();
create trigger organizations_updated_at before update on organizations
  for each row execute function update_updated_at();
