# Supabase Setup Instructions

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and anon key

## 2. Create Database Tables

Run these SQL commands in your Supabase SQL editor:

```sql
-- Create consultation_submissions table
CREATE TABLE consultation_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pins JSONB NOT NULL,
  form_data JSONB NOT NULL,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create an index for faster queries
CREATE INDEX idx_consultation_submissions_approved ON consultation_submissions(approved);
CREATE INDEX idx_consultation_submissions_created_at ON consultation_submissions(created_at);
```

## 2.1. Add Processed Column (Optional - for Admin Features)

If you want to mark submissions as processed in the admin panel, add this column:

```sql
-- Add processed column to track which submissions have been processed
ALTER TABLE consultation_submissions 
ADD COLUMN IF NOT EXISTS processed BOOLEAN DEFAULT false;

-- Create an index for faster queries
CREATE INDEX idx_consultation_submissions_processed ON consultation_submissions(processed);
```

## 3. Environment Variables

Create a `.env` file in your project root with:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_MAPBOX_TOKEN=your_mapbox_access_token
```

### Getting a Mapbox Token:
1. Go to [mapbox.com](https://www.mapbox.com/) and create a free account
2. Go to your [Account page](https://account.mapbox.com/)
3. Copy your **Default public token**
4. Add it to your `.env` file as `VITE_MAPBOX_TOKEN`

**Note:** The free tier includes 50,000 map loads per month - more than enough for most projects!

## 4. Row Level Security (RLS)

Enable RLS on the table:

```sql
-- Enable RLS
ALTER TABLE consultation_submissions ENABLE ROW LEVEL SECURITY;

-- IMPORTANT: Drop the old policy if it exists
DROP POLICY IF EXISTS "Allow public insert access" ON consultation_submissions;

-- Allow public insert access (for form submissions)
-- Use WITH CHECK (true) to allow any insert from authenticated or anonymous users
CREATE POLICY "Enable insert for all users" ON consultation_submissions
FOR INSERT 
WITH CHECK (true);

-- Allow public read access to approved submissions
CREATE POLICY "Allow public read access to approved submissions" ON consultation_submissions
FOR SELECT 
USING (approved = true);
```

If you're still having issues, you can temporarily disable RLS for testing:

```sql
-- Disable RLS (for testing only - not recommended for production)
ALTER TABLE consultation_submissions DISABLE ROW LEVEL SECURITY;
```

## 5. Admin Access

For admin functions (approving submissions), you'll need to create additional policies or use the Supabase dashboard directly.

## Features

- **Automatic data collection**: Pins and form data are automatically saved to Supabase
- **Community suggestions page**: View all approved suggestions at `/suggestions`
- **Real-time updates**: New submissions appear immediately (when approved)
- **Moderation system**: Submissions are approved by default to false for moderation
