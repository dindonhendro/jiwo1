-- Add education field to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS education TEXT;