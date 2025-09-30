-- Add sentiment_score column to journals table
ALTER TABLE journals ADD COLUMN IF NOT EXISTS sentiment_score DECIMAL(3,2);