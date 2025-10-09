ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS age INTEGER;

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS nickname TEXT;

UPDATE public.users SET nickname = full_name WHERE nickname IS NULL;