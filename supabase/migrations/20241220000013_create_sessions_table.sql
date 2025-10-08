create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  step int not null default 1,
  user_message text,
  created_at timestamp with time zone default now()
);

create index if not exists idx_sessions_user_id on sessions(user_id);
create index if not exists idx_sessions_created_at on sessions(created_at);

alter publication supabase_realtime add table sessions;