-- Fix RLS policies for users table to allow INSERT and UPDATE operations

-- Drop existing policy if it exists and recreate with proper permissions
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;

-- Create comprehensive policies for users table
CREATE POLICY "Users can view own data" 
ON public.users FOR SELECT 
USING (auth.uid()::text = user_id OR auth.uid() = id);

CREATE POLICY "Users can insert own data" 
ON public.users FOR INSERT 
WITH CHECK (auth.uid()::text = user_id OR auth.uid() = id);

CREATE POLICY "Users can update own data" 
ON public.users FOR UPDATE 
USING (auth.uid()::text = user_id OR auth.uid() = id)
WITH CHECK (auth.uid()::text = user_id OR auth.uid() = id);