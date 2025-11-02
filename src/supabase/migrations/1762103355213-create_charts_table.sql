/*
# Create Charts Table

1. New Tables
- `charts` - Main table for storing accountability charts
  - `id` (uuid, primary key) - Unique identifier for each chart
  - `user_id` (uuid, foreign key) - Reference to the authenticated user
  - `title` (text) - Chart title
  - `description` (text) - Optional chart description
  - `positions` (jsonb) - JSON object containing position data
  - `created_at` (timestamptz) - Timestamp when chart was created
  - `updated_at` (timestamptz) - Timestamp when chart was last updated

2. Security
- Enable Row Level Security (RLS) on `charts` table
- Add policies for authenticated users to manage their own charts
  - Users can insert their own charts
  - Users can select their own charts
  - Users can update their own charts
  - Users can delete their own charts
  - Anonymous users have no access

3. Indexes
- Add index on `user_id` for faster user-specific queries
- Add index on `created_at` for sorting by creation date
*/

CREATE TABLE IF NOT EXISTS charts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  positions jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE charts ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_charts_user_id ON charts(user_id);
CREATE INDEX IF NOT EXISTS idx_charts_created_at ON charts(created_at DESC);

-- RLS Policies
CREATE POLICY "Users can insert their own charts" ON charts
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own charts" ON charts
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own charts" ON charts
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own charts" ON charts
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at on row updates
CREATE TRIGGER update_charts_updated_at
  BEFORE UPDATE ON charts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();