-- Update screenings table to support GDS-15 and EPDS screening types
ALTER TABLE screenings DROP CONSTRAINT IF EXISTS valid_screening_types;
ALTER TABLE screenings ADD CONSTRAINT valid_screening_types 
  CHECK (type IN ('PHQ-9', 'GAD-7', 'GDS-15', 'EPDS'));

-- Update severity levels to include new types
ALTER TABLE screenings DROP CONSTRAINT IF EXISTS valid_severity_levels;
ALTER TABLE screenings ADD CONSTRAINT valid_severity_levels 
  CHECK (severity IN ('Minimal', 'Ringan', 'Sedang', 'Berat', 'Normal', 'Depresi Ringan', 'Depresi Berat'));