import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Use service role key for server-side storage operations
const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Use anon key for database queries
const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

interface ContentData {
  heroPhotos?: any[];
  sectionBackgrounds?: any;
  pageBackgrounds?: any;
  bannerSettings?: any;
  books?: any[];
  songs?: any[];
  contactInfo?: any;
  templeHistory?: any;
  about?: any;
  timings?: any;
  timingsSection?: any;
  sevaSection?: any;
  templeBoxes?: any;
}

// Use Netlify Blobs in production, localStorage simulation in development
const isDev = process.env.NODE_ENV === 'development';

let devStorage: ContentData = {};

export async function GET() {
  try {
    // Always fetch from Supabase regardless of environment
    if (!supabaseAdmin) {
      console.error('Supabase not configured');
      return Response.json({}, { status: 500 });
    }

    // Fetch hero photos from database
    const heroPhotosResponse = await supabaseAdmin
      .from('hero_images')
      .select('*');

    const bannerAssetsResponse = await supabaseAdmin
      .from('banner_assets')
      .select('*');

    const sectionBackgroundsResponse = await supabaseAdmin
      .from('section_backgrounds')
      .select('*');

    const albumImagesResponse = await supabaseAdmin
      .from('album_images')
      .select('*');

    const pageBackgroundsResponse = await supabaseAdmin
      .from('page_backgrounds')
      .select('*');

    if (heroPhotosResponse.error) {
      console.error('Failed to fetch hero photos:', heroPhotosResponse.error);
      return Response.json({ error: 'Failed to fetch hero photos' }, { status: 500 });
    }

    // For development mode, also use in-memory storage as fallback
    const contentWithAllImages = {
      heroPhotos: heroPhotosResponse.data || [],
      bannerAssets: bannerAssetsResponse.data || [],
      sectionBackgrounds: sectionBackgroundsResponse.data || [],
      albumImages: albumImagesResponse.data || [],
      pageBackgrounds: pageBackgroundsResponse.data || [],
      ...devStorage,
    };

    return Response.json(contentWithAllImages || {});
  } catch (error) {
    console.error('Unexpected error reading content:', error);
    return Response.json({}, { status: 500 });
  }
}

export async function POST(request: Request) {
  const newContent = await request.json();

  try {
    if (isDev) {
      // In development, use in-memory storage
      devStorage = { ...devStorage, ...newContent };
      return Response.json({ success: true, content: devStorage });
    } else {
      if (!supabase) {
        console.error('Supabase not configured');
        return Response.json({ error: 'Failed to update content' }, { status: 500 });
      }

      const { error } = await supabase
        .from('content')
        .upsert(newContent);

      if (error) {
        console.error('Error updating content:', error);
        return Response.json({ error: 'Failed to update content' }, { status: 500 });
      }

      return Response.json({ success: true });
    }
  } catch (error) {
    console.error('Unexpected error updating content:', error);
    return Response.json({ error: 'Failed to update content' }, { status: 500 });
  }
}

