-- Drop existing foreign key constraints
ALTER TABLE public.chats 
DROP CONSTRAINT IF EXISTS chats_professional_id_fkey;

-- Recreate with reference to professionals table instead
ALTER TABLE public.chats 
ADD CONSTRAINT chats_professional_id_fkey 
FOREIGN KEY (professional_id) 
REFERENCES public.professionals(id) 
ON DELETE CASCADE;

-- Also ensure users table allows inserts
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;

CREATE POLICY "Users can insert own data" 
ON public.users FOR INSERT 
WITH CHECK (auth.uid() = id);
