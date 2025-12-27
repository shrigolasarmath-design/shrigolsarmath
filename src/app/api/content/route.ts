import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
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
    if (isDev) {
      // In development, return in-memory storage
      return Response.json(devStorage);
    } else {
      if (!supabase) {
        console.error('Supabase not configured');
        return Response.json({}, { status: 500 });
      }

      const { data: content, error } = await supabase
        .from('content')
        .select('*');

      if (error) {
        console.error('Error fetching content:', error);
        return Response.json({}, { status: 500 });
      }

      return Response.json(content || {});
    }
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

