-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.chats CASCADE;
DROP TABLE IF EXISTS public.professionals CASCADE;

-- Professionals table dengan improvements
CREATE TABLE public.professionals (
    id uuid PRIMARY KEY NOT NULL,
    name text,
    full_name text NOT NULL,
    email text UNIQUE NOT NULL,
    specialization text NOT NULL,
    license_number text UNIQUE,
    phone text,
    bio text,
    rating numeric(3,2) DEFAULT 5.00 CHECK (rating >= 0.00 AND rating <= 5.00),
    years_of_experience integer CHECK (years_of_experience >= 0 AND years_of_experience <= 60),
    is_verified boolean DEFAULT false,
    is_available boolean DEFAULT true,
    languages text[] DEFAULT '{"Indonesian", "English"}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    -- Foreign key constraint
    CONSTRAINT professionals_id_fkey 
        FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Additional constraints
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (phone IS NULL OR phone ~ '^\+?[0-9\s\-\(\)]{10,}$')
);

-- Chats table dengan improvements
CREATE TABLE public.chats (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    professional_id uuid NOT NULL,
    message text NOT NULL CHECK (length(trim(message)) > 0),
    sender text NOT NULL CHECK (sender IN ('user', 'professional')),
    created_at timestamptz DEFAULT now(),
    image_url text,
    read_at timestamptz,
    message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
    
    -- Foreign key constraints
    CONSTRAINT chats_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT chats_professional_id_fkey 
        FOREIGN KEY (professional_id) REFERENCES public.professionals(id) ON DELETE CASCADE,
    
    -- Additional constraints
    CONSTRAINT valid_image_url CHECK (
        image_url IS NULL OR 
        image_url ~* '^https?://.+\..+'
    ),
    CONSTRAINT message_content_check CHECK (
        (message_type = 'text' AND length(trim(message)) > 0) OR
        (message_type = 'image' AND image_url IS NOT NULL) OR
        (message_type IN ('file', 'system'))
    )
);

-- Indexes untuk professionals
CREATE INDEX IF NOT EXISTS idx_professionals_email ON public.professionals(email);
CREATE INDEX IF NOT EXISTS idx_professionals_specialization ON public.professionals(specialization);
CREATE INDEX IF NOT EXISTS idx_professionals_is_available ON public.professionals(is_available);
CREATE INDEX IF NOT EXISTS idx_professionals_is_verified ON public.professionals(is_verified);
CREATE INDEX IF NOT EXISTS idx_professionals_rating ON public.professionals(rating DESC);
CREATE INDEX IF NOT EXISTS idx_professionals_created_at ON public.professionals(created_at DESC);

-- Indexes untuk chats
CREATE INDEX IF NOT EXISTS idx_chats_user_professional ON public.chats(user_id, professional_id);
CREATE INDEX IF NOT EXISTS idx_chats_created_at ON public.chats(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chats_sender ON public.chats(sender);
CREATE INDEX IF NOT EXISTS idx_chats_message_type ON public.chats(message_type);
CREATE INDEX IF NOT EXISTS idx_chats_read_status ON public.chats(read_at) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_chats_conversation ON public.chats(
    LEAST(user_id, professional_id), 
    GREATEST(user_id, professional_id), 
    created_at DESC
);

-- Enable RLS
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for professionals
CREATE POLICY "Allow all for authenticated" 
ON public.professionals 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all for service_role" 
ON public.professionals 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- RLS Policies for chats
CREATE POLICY "Users can view their own chats" 
ON public.chats 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id OR auth.uid() = professional_id);

CREATE POLICY "Users can insert their own messages" 
ON public.chats 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id OR auth.uid() = professional_id);

CREATE POLICY "Allow all for service_role" 
ON public.chats 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Triggers untuk auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_professionals_updated_at 
    BEFORE UPDATE ON public.professionals
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Trigger untuk chat notifications
CREATE OR REPLACE FUNCTION notify_new_chat_message()
RETURNS TRIGGER AS $$
BEGIN
    -- Logic untuk notifications bisa ditambahkan di sini
    -- Misalnya: INSERT INTO notifications table
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_chat_message
    AFTER INSERT ON public.chats
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_chat_message();

-- Enable realtime
alter publication supabase_realtime add table professionals;
alter publication supabase_realtime add table chats;