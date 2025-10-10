-- Drop and recreate journals table to fix schema cache issues
DROP TABLE IF EXISTS public.journals CASCADE;

-- Create journals table with proper structure
CREATE TABLE public.journals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  ai_summary TEXT,
  mood TEXT,
  sentiment_score DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;

-- Create permissive policies
CREATE POLICY "Allow all for authenticated" 
ON public.journals 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all for service_role" 
ON public.journals 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Enable realtime
alter publication supabase_realtime add table journals;