-- Drop and recreate users table to fix schema cache issues
DROP TABLE IF EXISTS public.users CASCADE;

-- Create users table with all required columns
CREATE TABLE public.users (
    id uuid PRIMARY KEY NOT NULL,
    name text DEFAULT '',
    nickname text DEFAULT '',
    email text,
    gender text DEFAULT '',
    age integer DEFAULT 0,
    education text DEFAULT '',
    role text DEFAULT 'user',
    token_identifier text DEFAULT '',
    avatar_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create permissive policies
CREATE POLICY "Allow all for authenticated" 
ON public.users 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all for service_role" 
ON public.users 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Enable realtime
alter publication supabase_realtime add table users;