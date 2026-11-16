-- SQL SCHEMA FOR SUPABASE

-- 1. Create Categories Table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Prompts Table
CREATE TABLE prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  prompt_text TEXT,
  content_type TEXT NOT NULL DEFAULT 'prompt' CHECK (content_type IN ('prompt', 'source_code')),
  download_url TEXT,
  source_code_snippet TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Upgrade existing installations to support source-code lessons.
ALTER TABLE prompts ALTER COLUMN prompt_text DROP NOT NULL;

ALTER TABLE prompts
ADD COLUMN IF NOT EXISTS content_type TEXT NOT NULL DEFAULT 'prompt';

ALTER TABLE prompts ADD COLUMN IF NOT EXISTS download_url TEXT;

ALTER TABLE prompts
ADD COLUMN IF NOT EXISTS source_code_snippet TEXT;

DO $$ BEGIN
  ALTER TABLE prompts ADD CONSTRAINT prompts_content_type_check CHECK (content_type IN ('prompt', 'source_code'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 3. Create Settings Table
CREATE TABLE settings (
    id TEXT PRIMARY KEY,
  content TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- QRIS images uploaded from the admin settings page.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('lms-assets', 'lms-assets', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DO $$ BEGIN
    CREATE POLICY "Public read LMS assets" ON storage.objects FOR SELECT USING (bucket_id = 'lms-assets');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Authenticated upload LMS assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'lms-assets' AND auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE POLICY "Authenticated update LMS assets" ON storage.objects FOR UPDATE USING (bucket_id = 'lms-assets' AND auth.role() = 'authenticated') WITH CHECK (bucket_id = 'lms-assets' AND auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 4. Create Page Views Table (Analytics & Visitor Logs)
CREATE TABLE page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- 6. Policies: Public Select & Insert
CREATE POLICY "Public Select Categories" ON categories FOR
SELECT USING (true);

CREATE POLICY "Public Select Prompts" ON prompts FOR
SELECT USING (true);

CREATE POLICY "Public Select Settings" ON settings FOR
SELECT USING (true);

CREATE POLICY "Public Insert Page Views" ON page_views FOR
INSERT
WITH
    CHECK (true);

CREATE POLICY "Public Select Page Views" ON page_views FOR
SELECT USING (true);

-- 7. Policies: Admin All
CREATE POLICY "Admin All Categories" ON categories ALL USING (
    auth.role () = 'authenticated'
);

CREATE POLICY "Admin All Prompts" ON prompts ALL USING (
    auth.role () = 'authenticated'
);

CREATE POLICY "Admin All Settings" ON settings ALL USING (
    auth.role () = 'authenticated'
);

CREATE POLICY "Admin All Page Views" ON page_views ALL USING (
    auth.role () = 'authenticated'
);

-- 8. Seed Data
INSERT INTO
    categories (name, slug)
VALUES ('ChatGPT', 'chatgpt'),
    ('Claude AI', 'claude-ai'),
    (
        'Google Studio',
        'google-studio'
    ),
    ('DeepSeek', 'deepseek');

INSERT INTO
    settings (id, content)
VALUES ('adsterra_top', ''),
    ('adsterra_sidebar', ''),
    ('adsterra_bottom', ''),
    ('whatsapp_number', ''),
    ('qris_image_url', ''),
    (
        'donation_info',
        'Silakan scan QRIS di atas untuk donasi seikhlasnya.'
    ) ON CONFLICT (id) DO NOTHING;

-- Sample Page Views Data for Analytics Demo (Optional)
INSERT INTO
    page_views (page_path, created_at)
VALUES (
        '/',
        NOW() - INTERVAL '1 hour'
    ),
    (
        '/',
        NOW() - INTERVAL '3 hours'
    ),
    (
        '/detail/1',
        NOW() - INTERVAL '5 hours'
    ),
    ('/', NOW() - INTERVAL '1 day'),
    (
        '/',
        NOW() - INTERVAL '2 days'
    ),
    (
        '/',
        NOW() - INTERVAL '5 days'
    ),
    (
        '/',
        NOW() - INTERVAL '10 days'
    ),
    (
        '/',
        NOW() - INTERVAL '25 days'
    ),
    (
        '/',
        NOW() - INTERVAL '40 days'
    );