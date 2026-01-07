-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles (Extends Auth users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  full_name text,
  avatar_url text,
  role text default 'user', -- 'admin', 'user'
  created_at timestamptz default now()
);

-- Blogs
create table public.blogs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  content text,
  cover_image text,
  published boolean default false,
  author_id uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- Courses
create table public.courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  thumbnail text,
  published boolean default false,
  price decimal default 0,
  created_at timestamptz default now()
);

-- Lessons
create table public.lessons (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade,
  title text not null,
  video_url text,
  order_index int,
  created_at timestamptz default now()
);

-- Tournaments
create table public.tournaments (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  start_date timestamptz,
  max_players int,
  location text,
  status text default 'upcoming',
  created_at timestamptz default now()
);

-- Participants
create table public.participants (
  id uuid default gen_random_uuid() primary key,
  tournament_id uuid references public.tournaments(id) on delete cascade,
  user_id uuid references public.profiles(id),
  score decimal default 0,
  created_at timestamptz default now(),
  unique(tournament_id, user_id)
);

-- Matches
create table public.matches (
  id uuid default gen_random_uuid() primary key,
  tournament_id uuid references public.tournaments(id) on delete cascade,
  round int not null,
  player1_id uuid references public.participants(id),
  player2_id uuid references public.participants(id),
  result text, -- '1-0', '0-1', '1/2-1/2'
  verified boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.blogs enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.tournaments enable row level security;
alter table public.participants enable row level security;
alter table public.matches enable row level security;

-- Policies (Simplified for initial setup)
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Public blogs are viewable by everyone" on public.blogs for select using (true);
-- Admin policies would check for role='admin' in profiles table (requires helper function or join)

-- Trigger to create profile on signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
