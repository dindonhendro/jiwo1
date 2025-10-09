ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS nickname TEXT,
ADD COLUMN IF NOT EXISTS age INTEGER;

UPDATE public.users SET nickname = full_name WHERE nickname IS NULL;

alter publication supabase_realtime add table users;
