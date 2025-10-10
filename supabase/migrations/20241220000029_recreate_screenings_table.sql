-- Drop and recreate screenings table to fix schema cache issues
DROP TABLE IF EXISTS public.screenings CASCADE;

-- Create screenings table with proper structure
CREATE TABLE public.screenings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  score INTEGER NOT NULL,
  answers JSONB NOT NULL,
  severity TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.screenings ENABLE ROW LEVEL SECURITY;

-- Create permissive policies
CREATE POLICY "Allow all for authenticated" 
ON public.screenings 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all for service_role" 
ON public.screenings 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Enable realtime
alter publication supabase_realtime add table screenings;