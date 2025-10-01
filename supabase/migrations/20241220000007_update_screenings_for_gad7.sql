-- Update screenings table to better support GAD-7 and other screening types
ALTER TABLE screenings ADD COLUMN IF NOT EXISTS condition TEXT;

-- First, update any existing data to match our expected values
UPDATE screenings 
SET severity = CASE 
  WHEN severity ILIKE '%minimal%' OR severity ILIKE '%minimum%' THEN 'Minimal'
  WHEN severity ILIKE '%ringan%' OR severity ILIKE '%mild%' OR severity ILIKE '%light%' THEN 'Ringan'
  WHEN severity ILIKE '%sedang%' OR severity ILIKE '%moderate%' OR severity ILIKE '%medium%' THEN 'Sedang'
  WHEN severity ILIKE '%berat%' OR severity ILIKE '%severe%' OR severity ILIKE '%heavy%' THEN 'Berat'
  ELSE 'Minimal'
END;

-- Update type field to ensure consistency
UPDATE screenings 
SET type = CASE 
  WHEN type ILIKE '%phq%' OR type ILIKE '%depression%' THEN 'PHQ-9'
  WHEN type ILIKE '%gad%' OR type ILIKE '%anxiety%' THEN 'GAD-7'
  ELSE type
END;

-- Add check constraint for valid screening types
ALTER TABLE screenings DROP CONSTRAINT IF EXISTS valid_screening_types;
ALTER TABLE screenings ADD CONSTRAINT valid_screening_types 
  CHECK (type IN ('PHQ-9', 'GAD-7'));

-- Add check constraint for valid severity levels
ALTER TABLE screenings DROP CONSTRAINT IF EXISTS valid_severity_levels;
ALTER TABLE screenings ADD CONSTRAINT valid_severity_levels 
  CHECK (severity IN ('Minimal', 'Ringan', 'Sedang', 'Berat'));

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_screenings_type ON screenings(type);
CREATE INDEX IF NOT EXISTS idx_screenings_user_type ON screenings(user_id, type);
CREATE INDEX IF NOT EXISTS idx_screenings_created_at ON screenings(created_at);

-- Update existing records to have condition field
UPDATE screenings 
SET condition = CASE 
  WHEN type = 'PHQ-9' THEN 'Depresi'
  WHEN type = 'GAD-7' THEN 'Kecemasan'
  ELSE 'Unknown'
END
WHERE condition IS NULL;