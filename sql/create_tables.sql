-- Create table for hero images
CREATE TABLE IF NOT EXISTS hero_images (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create table for banner assets
CREATE TABLE IF NOT EXISTS banner_assets (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create table for section backgrounds
CREATE TABLE IF NOT EXISTS section_backgrounds (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create table for album images (gallery)
CREATE TABLE IF NOT EXISTS album_images (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    album_id TEXT,
    title TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create table for page backgrounds
CREATE TABLE IF NOT EXISTS page_backgrounds (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    page_name TEXT,
    title TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create section_backgrounds bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('section_backgrounds', 'section_backgrounds', false);

-- Create banner_assets bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('banner_assets', 'banner_assets', false);

-- Create album_images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('album_images', 'album_images', false);

-- Create page_backgrounds bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('page_backgrounds', 'page_backgrounds', false);

-- Create RLS policies for hero_images bucket
CREATE POLICY "service_role_hero_images" ON storage.objects
  FOR ALL USING (bucket_id = 'hero_images') WITH CHECK (bucket_id = 'hero_images');

-- Create RLS policies for section_backgrounds bucket
CREATE POLICY "service_role_backgrounds" ON storage.objects
  FOR ALL USING (bucket_id = 'section_backgrounds') WITH CHECK (bucket_id = 'section_backgrounds');

-- Create RLS policies for banner_assets bucket
CREATE POLICY "service_role_banner" ON storage.objects
  FOR ALL USING (bucket_id = 'banner_assets') WITH CHECK (bucket_id = 'banner_assets');

-- Create RLS policies for album_images bucket
CREATE POLICY "service_role_album_images" ON storage.objects
  FOR ALL USING (bucket_id = 'album_images') WITH CHECK (bucket_id = 'album_images');

-- Create RLS policies for page_backgrounds bucket
CREATE POLICY "service_role_page_backgrounds" ON storage.objects
  FOR ALL USING (bucket_id = 'page_backgrounds') WITH CHECK (bucket_id = 'page_backgrounds');