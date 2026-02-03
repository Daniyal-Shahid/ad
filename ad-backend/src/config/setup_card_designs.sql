-- Card Designs Table Setup
-- Run this script in Supabase SQL Editor to create the card_designs table

-- Create card_designs table
CREATE TABLE IF NOT EXISTS card_designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) DEFAULT 'Untitled Card',
  design_data JSONB NOT NULL,
  is_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_card_designs_user_id ON card_designs(user_id);
CREATE INDEX IF NOT EXISTS idx_card_designs_updated_at ON card_designs(updated_at DESC);

-- Enable Row Level Security
ALTER TABLE card_designs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own designs" ON card_designs;
DROP POLICY IF EXISTS "Users can create own designs" ON card_designs;
DROP POLICY IF EXISTS "Users can update own designs" ON card_designs;
DROP POLICY IF EXISTS "Users can delete own designs" ON card_designs;

-- RLS Policy: Users can view their own designs
CREATE POLICY "Users can view own designs"
  ON card_designs FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can create their own designs
CREATE POLICY "Users can create own designs"
  ON card_designs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own designs
CREATE POLICY "Users can update own designs"
  ON card_designs FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policy: Users can delete their own designs
CREATE POLICY "Users can delete own designs"
  ON card_designs FOR DELETE
  USING (auth.uid() = user_id);

-- Create or replace function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_card_designs_updated_at ON card_designs;

CREATE TRIGGER update_card_designs_updated_at
  BEFORE UPDATE ON card_designs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Verify table creation
SELECT 'card_designs table created successfully' AS status;
