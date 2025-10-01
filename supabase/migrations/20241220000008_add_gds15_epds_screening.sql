-- Add CV and admin functionality to professionals table
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS cv_data JSONB;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS education TEXT[];
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS certifications TEXT[];
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS work_experience JSONB[];
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS skills TEXT[];
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Create admin roles table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'moderator')),
  permissions TEXT[] DEFAULT ARRAY['read'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create yoga vendors table
CREATE TABLE IF NOT EXISTS yoga_vendors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  services TEXT[],
  pricing JSONB,
  rating DECIMAL(2,1) DEFAULT 5.0,
  images TEXT[],
  is_active BOOLEAN DEFAULT true,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update professionals with CV data
UPDATE professionals SET 
  cv_data = jsonb_build_object(
    'summary', bio,
    'specializations', ARRAY[specialty],
    'languages', languages
  ),
  education = CASE 
    WHEN name LIKE 'Dr.%' THEN ARRAY['Medical Degree - University of Indonesia', 'Residency in Psychiatry - RSUPN Dr. Cipto Mangunkusumo']
    ELSE ARRAY['Master in Psychology - University of Indonesia', 'Bachelor in Psychology - Universitas Gadjah Mada']
  END,
  certifications = CASE 
    WHEN treatment_type = 'psychiatrist' THEN ARRAY['Board Certified Psychiatrist', 'Indonesian Medical Association Member']
    WHEN treatment_type = 'psychologist' THEN ARRAY['Licensed Clinical Psychologist', 'CBT Certification', 'Indonesian Psychology Association Member']
    WHEN treatment_type = 'nutrition' THEN ARRAY['Registered Dietitian', 'Nutritional Psychiatry Certification']
    WHEN treatment_type = 'life-coaching' THEN ARRAY['Certified Life Coach', 'Stress Management Specialist']
    WHEN treatment_type = 'holistic-yoga' THEN ARRAY['500-Hour Yoga Teacher Training', 'Trauma-Informed Yoga Certification']
    ELSE ARRAY['Art Therapy Certification', 'Creative Arts Therapy License']
  END,
  work_experience = CASE 
    WHEN experience_years >= 15 THEN 
      ARRAY[
        '{"position": "Senior Consultant", "organization": "Jakarta Mental Health Center", "duration": "2015-Present", "description": "Leading clinical practice and supervision"}'::jsonb,
        '{"position": "Clinical Specialist", "organization": "Siloam Hospital", "duration": "2010-2015", "description": "Specialized treatment and patient care"}'::jsonb
      ]
    WHEN experience_years >= 10 THEN
      ARRAY[
        '{"position": "Clinical Practitioner", "organization": "RS Pondok Indah", "duration": "2018-Present", "description": "Individual and group therapy sessions"}'::jsonb,
        '{"position": "Associate Therapist", "organization": "Klinik Jiwa", "duration": "2014-2018", "description": "Patient assessment and treatment planning"}'::jsonb
      ]
    ELSE
      ARRAY[
        '{"position": "Clinical Associate", "organization": "Mental Health Clinic", "duration": "2020-Present", "description": "Patient care and therapy sessions"}'::jsonb
      ]
  END,
  skills = CASE 
    WHEN treatment_type = 'psychiatrist' THEN ARRAY['Medication Management', 'Crisis Intervention', 'Diagnostic Assessment', 'Psychopharmacology']
    WHEN treatment_type = 'psychologist' THEN ARRAY['Cognitive Behavioral Therapy', 'Trauma Therapy', 'Group Therapy', 'Psychological Assessment']
    WHEN treatment_type = 'nutrition' THEN ARRAY['Nutritional Assessment', 'Meal Planning', 'Supplement Therapy', 'Gut-Brain Health']
    WHEN treatment_type = 'life-coaching' THEN ARRAY['Goal Setting', 'Stress Management', 'Mindfulness', 'Work-Life Balance']
    WHEN treatment_type = 'holistic-yoga' THEN ARRAY['Yoga Therapy', 'Meditation', 'Breathwork', 'Trauma-Informed Practice']
    ELSE ARRAY['Art Therapy', 'Creative Expression', 'Emotional Processing', 'Group Facilitation']
  END;

-- Insert sample yoga vendors
INSERT INTO yoga_vendors (name, description, location, contact_email, contact_phone, services, pricing, rating, images) VALUES
('Serenity Yoga Studio', 'Holistic yoga and wellness center specializing in therapeutic yoga for mental health', 'Jakarta Selatan', 'info@serenityyoga.id', '+62-21-1234-5678', 
 ARRAY['Therapeutic Yoga', 'Trauma-Informed Yoga', 'Meditation Classes', 'Breathwork Sessions'], 
 '{"individual": 150000, "group": 100000, "package_10": 1200000}'::jsonb, 4.8, 
 ARRAY['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80']),

('Mindful Movement Center', 'Integrative wellness center combining yoga therapy with mental health support', 'Jakarta Pusat', 'hello@mindfulmovement.id', '+62-21-2345-6789',
 ARRAY['Yoga Therapy', 'Mindfulness Training', 'Stress Relief Programs', 'Corporate Wellness'], 
 '{"individual": 180000, "group": 120000, "corporate": 2500000}'::jsonb, 4.7,
 ARRAY['https://images.unsplash.com/photo-1506126613408-eca07ce68e71?w=800&q=80']),

('Healing Lotus Yoga', 'Traditional yoga practice with modern therapeutic approaches for anxiety and depression', 'Bandung', 'contact@healinglotus.id', '+62-22-3456-7890',
 ARRAY['Hatha Yoga', 'Restorative Yoga', 'Anxiety Relief Classes', 'Depression Support Groups'], 
 '{"individual": 120000, "group": 80000, "monthly_unlimited": 800000}'::jsonb, 4.9,
 ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80']);

-- Insert sample admin user (you'll need to replace with actual user ID)
-- INSERT INTO admin_users (user_id, role, permissions) VALUES 
-- ('your-admin-user-id', 'super_admin', ARRAY['read', 'write', 'delete', 'manage_users', 'manage_professionals', 'manage_vendors']);

-- Enable realtime
alter publication supabase_realtime add table admin_users;
alter publication supabase_realtime add table yoga_vendors;