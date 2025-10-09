ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS education TEXT;

ALTER TABLE public.professionals 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS specialization TEXT,
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;

UPDATE public.professionals SET full_name = name WHERE full_name IS NULL;
UPDATE public.professionals SET specialization = specialty WHERE specialization IS NULL;
