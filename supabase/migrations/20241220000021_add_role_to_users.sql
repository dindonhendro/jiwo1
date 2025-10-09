ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

UPDATE public.users SET role = 'user' WHERE role IS NULL;
