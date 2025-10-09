-- Enable RLS on chats table
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can insert their own messages" ON public.chats;
DROP POLICY IF EXISTS "Users can view their own messages" ON public.chats;
DROP POLICY IF EXISTS "Professionals can view their messages" ON public.chats;

-- Allow users to insert messages
CREATE POLICY "Users can insert their own messages" 
ON public.chats FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to view their messages
CREATE POLICY "Users can view their own messages" 
ON public.chats FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = professional_id);
