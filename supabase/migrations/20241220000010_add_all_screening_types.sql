-- Update screenings table to support all screening types
ALTER TABLE screenings DROP CONSTRAINT IF EXISTS valid_screening_types;
ALTER TABLE screenings ADD CONSTRAINT valid_screening_types 
  CHECK (type IN ('PHQ-9', 'GAD-7', 'GDS-15', 'EPDS'));

-- Update condition mapping for new screening types
UPDATE screenings 
SET condition = CASE 
  WHEN type = 'PHQ-9' THEN 'Depresi'
  WHEN type = 'GAD-7' THEN 'Kecemasan'
  WHEN type = 'GDS-15' THEN 'Depresi Lansia'
  WHEN type = 'EPDS' THEN 'Depresi Pasca Melahirkan'
  ELSE condition
END;