-- Add the missing condition column to screenings table
ALTER TABLE public.screenings ADD COLUMN IF NOT EXISTS condition TEXT;

-- Update existing records to have condition field based on type
UPDATE screenings 
SET condition = CASE 
  WHEN type = 'PHQ-9' THEN 'Depresi'
  WHEN type = 'GAD-7' THEN 'Kecemasan'
  WHEN type = 'GDS-15' THEN 'Depresi Geriatri'
  WHEN type = 'EPDS' THEN 'Depresi Postpartum'
  WHEN type = 'DASS-21' THEN 'Depresi, Kecemasan, Stres'
  WHEN type = 'PSS-10' THEN 'Stres'
  WHEN type = 'SWLS' THEN 'Kepuasan Hidup'
  WHEN type = 'AUDIT' THEN 'Alkohol'
  WHEN type = 'CAGE' THEN 'Alkohol'
  WHEN type = 'MINI' THEN 'Gangguan Mental'
  ELSE 'Unknown'
END
WHERE condition IS NULL;