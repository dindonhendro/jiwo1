-- Fix RLS policy for users table to allow service role inserts
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;

CREATE POLICY "Users can insert own data" 
ON public.users FOR INSERT 
WITH CHECK (true);

-- Add name column to professionals and make full_name nullable
ALTER TABLE public.professionals 
ADD COLUMN IF NOT EXISTS name TEXT;

-- Update existing professionals to copy full_name to name
UPDATE public.professionals SET name = full_name WHERE name IS NULL;

-- Now make name NOT NULL
ALTER TABLE public.professionals 
ALTER COLUMN name SET NOT NULL;
