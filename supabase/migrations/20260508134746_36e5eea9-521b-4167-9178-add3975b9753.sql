create table public.watch_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tmdb_id integer not null,
  media_type text not null check (media_type in ('movie','tv')),
  title text not null,
  poster_path text,
  backdrop_path text,
  season integer,
  episode integer,
  progress_seconds integer not null default 0,
  duration_seconds integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_id, tmdb_id, media_type)
);

alter table public.watch_progress enable row level security;

create policy "own rows select" on public.watch_progress for select using (auth.uid() = user_id);
create policy "own rows insert" on public.watch_progress for insert with check (auth.uid() = user_id);
create policy "own rows update" on public.watch_progress for update using (auth.uid() = user_id);
create policy "own rows delete" on public.watch_progress for delete using (auth.uid() = user_id);

create index watch_progress_user_updated_idx on public.watch_progress (user_id, updated_at desc);