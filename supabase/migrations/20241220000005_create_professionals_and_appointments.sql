CREATE TABLE IF NOT EXISTS professionals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  treatment_type TEXT NOT NULL,
  avatar TEXT,
  bio TEXT,
  experience_years INTEGER,
  rating DECIMAL(2,1) DEFAULT 5.0,
  price_per_session INTEGER,
  available_online BOOLEAN DEFAULT false,
  available_offline BOOLEAN DEFAULT true,
  languages TEXT[] DEFAULT ARRAY['Indonesian', 'English'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  treatment_type TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('online', 'offline')),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert dummy professionals data
INSERT INTO professionals (name, specialty, treatment_type, avatar, bio, experience_years, rating, price_per_session, available_online, available_offline, languages) VALUES
-- Psikiater
('Dr. Sarah Johnson', 'Clinical Psychiatrist', 'psychiatrist', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', 'Specialized in depression, anxiety, and mood disorders with 15+ years experience', 15, 4.9, 500000, true, true, ARRAY['Indonesian', 'English']),
('Dr. Michael Chen', 'Child Psychiatrist', 'psychiatrist', 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael', 'Expert in ADHD, autism spectrum disorders, and pediatric mental health', 12, 4.8, 450000, true, true, ARRAY['Indonesian', 'English', 'Mandarin']),
('Dr. Priya Sharma', 'Geriatric Psychiatrist', 'psychiatrist', 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya', 'Specializes in elderly mental health, dementia, and age-related disorders', 18, 4.9, 550000, false, true, ARRAY['Indonesian', 'English']),

-- Psikolog
('Dr. Amanda Wilson', 'Clinical Psychologist', 'psychologist', 'https://api.dicebear.com/7.x/avataaars/svg?seed=amanda', 'CBT specialist with expertise in anxiety disorders and trauma therapy', 10, 4.7, 350000, true, true, ARRAY['Indonesian', 'English']),
('Dr. Ravi Patel', 'Behavioral Psychologist', 'psychologist', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ravi', 'Focuses on behavioral interventions and addiction recovery programs', 8, 4.6, 300000, true, true, ARRAY['Indonesian', 'English']),
('Dr. Lisa Thompson', 'Family Therapist', 'psychologist', 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa', 'Relationship counseling and family dynamics specialist', 14, 4.8, 400000, true, true, ARRAY['Indonesian', 'English']),

-- Health Nutrisi
('Dr. Maria Rodriguez', 'Nutritional Psychiatrist', 'nutrition', 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria', 'Integrative approach combining nutrition and mental health', 7, 4.5, 250000, true, true, ARRAY['Indonesian', 'English', 'Spanish']),
('Dr. James Kim', 'Functional Medicine Nutritionist', 'nutrition', 'https://api.dicebear.com/7.x/avataaars/svg?seed=james', 'Gut-brain connection specialist and supplement therapy expert', 9, 4.7, 280000, true, true, ARRAY['Indonesian', 'English', 'Korean']),

-- Life Coaching
('Sarah Mitchell', 'Certified Life Coach', 'life-coaching', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarahmitchell', 'Executive coaching and stress management specialist', 6, 4.6, 200000, true, true, ARRAY['Indonesian', 'English']),
('David Brown', 'Wellness Coach', 'life-coaching', 'https://api.dicebear.com/7.x/avataaars/svg?seed=david', 'Work-life balance and burnout recovery expert', 5, 4.4, 180000, true, true, ARRAY['Indonesian', 'English']),

-- Holistik Yoga
('Anjali Devi', 'Yoga Therapist', 'holistic-yoga', 'https://api.dicebear.com/7.x/avataaars/svg?seed=anjali', 'Certified yoga therapist specializing in trauma-informed yoga', 12, 4.8, 150000, false, true, ARRAY['Indonesian', 'English', 'Sanskrit']),
('Marcus Johnson', 'Mindfulness Instructor', 'holistic-yoga', 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus', 'Meditation and breathwork specialist for anxiety and stress', 8, 4.7, 120000, false, true, ARRAY['Indonesian', 'English']),

-- Art Therapy
('Elena Vasquez', 'Art Therapist', 'art-therapy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=elena', 'Creative arts therapy for trauma and emotional expression', 11, 4.9, 300000, false, true, ARRAY['Indonesian', 'English']),
('Robert Lee', 'Music Therapist', 'art-therapy', 'https://api.dicebear.com/7.x/avataaars/svg?seed=robert', 'Music therapy for depression, anxiety, and developmental disorders', 9, 4.6, 250000, false, true, ARRAY['Indonesian', 'English']);

alter publication supabase_realtime add table professionals;
alter publication supabase_realtime add table appointments;