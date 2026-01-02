# SQL Queries for Image Management Tables

Run all these SQL queries in your Supabase SQL Editor to set up the complete image management system.

## 1. Create Tables

```sql
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
```

## 2. Create Storage Buckets

```sql
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
```

## 3. Create Row-Level Security (RLS) Policies

```sql
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
```

## Summary of Updates

### Tables Created:
1. **hero_images** - Stores hero banner photos
2. **banner_assets** - Stores banner logo and banner images
3. **section_backgrounds** - Stores background images for different sections
4. **album_images** - Stores gallery/album images
5. **page_backgrounds** - Stores individual page background images

### Buckets Created:
1. **hero_images** (already existed)
2. **banner_assets** (new)
3. **section_backgrounds** (new)
4. **album_images** (new)
5. **page_backgrounds** (new)

### Admin Pages Updated:
1. **admin/hero/page.tsx** - Now displays images from hero_images table using `url` field
2. **admin/banner/page.tsx** - Uploads to banner_assets bucket
3. **admin/backgrounds/page.tsx** - Uploads to section_backgrounds bucket
4. **admin/gallery/page.tsx** - Uploads to album_images bucket
5. **admin/page-backgrounds/page.tsx** - Uploads to page_backgrounds bucket

### API Updates:
1. **api/uploads/route.ts** - Updated to insert metadata into all respective tables
2. **api/content/route.ts** - Updated to fetch data from all image tables

All image uploads now store metadata in their respective database tables and display correctly across all admin pages and the homepage.
