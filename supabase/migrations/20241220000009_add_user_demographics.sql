-- Add gender and age columns to users table for mental health analysis
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS age INTEGER;

-- Add check constraint for valid gender values
ALTER TABLE users DROP CONSTRAINT IF EXISTS valid_gender;
ALTER TABLE users ADD CONSTRAINT valid_gender 
  CHECK (gender IN ('male', 'female', 'other') OR gender IS NULL);

-- Add check constraint for valid age range
ALTER TABLE users DROP CONSTRAINT IF EXISTS valid_age;
ALTER TABLE users ADD CONSTRAINT valid_age 
  CHECK (age >= 13 AND age <= 120 OR age IS NULL);