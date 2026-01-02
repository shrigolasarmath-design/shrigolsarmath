import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Use service role key for server-side storage access (bypass RLS)
const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Use anon key for database queries
const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!supabase || !supabaseAdmin) {
    return new Response('Supabase not configured', { status: 500 });
  }

  try {
    const { id: photoId } = await params;

    console.log('=== IMAGE FETCH DEBUG ===');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Photo ID:', photoId);

    // Get photo metadata from database
    const { data: photo, error } = await supabase
      .from('photos')
      .select('file_key')
      .eq('id', photoId)
      .single();

    if (error || !photo) {
      console.error('Photo not found in database - Photo ID:', photoId, 'Error:', error);
      return new Response('Photo not found', { status: 404 });
    }

    console.log('Photo found:', { file_key: photo.file_key });

    // Get file_key
    const filename: string | undefined = photo.file_key;

    if (!filename) {
      console.error('Photo missing file_key - Photo ID:', photoId);
      return new Response('Photo file not found', { status: 400 });
    }

    console.log('Using filename:', filename);

    // Always fetch from Supabase bucket
    console.log('=== FETCHING FROM SUPABASE STORAGE ===');
    console.log('bucket: album_images');
    console.log('Photo ID:', photoId);
    console.log('Looking for file_key:', filename);

    try {
      // Use service role key to bypass RLS on storage bucket
      const { data, error } = await supabaseAdmin.storage
        .from('album_images')
        .download(filename);

      if (error || !data) {
        console.error('=== SUPABASE FETCH FAILED ===');
        console.error('Error:', error);
        return new Response(JSON.stringify({
          error: 'File not found',
          fileKey: filename,
        }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      }

      console.log('File found! Size:', data.size, 'bytes');

      // Determine content type from filename
      const contentType = filename.endsWith('.png')
        ? 'image/png'
        : filename.endsWith('.jpg') || filename.endsWith('.jpeg')
        ? 'image/jpeg'
        : filename.endsWith('.gif')
        ? 'image/gif'
        : filename.endsWith('.webp')
        ? 'image/webp'
        : 'image/jpeg';

      console.log('Returning file with content-type:', contentType);
      return new Response(data, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    } catch (blobError) {
      console.error('=== SUPABASE FETCH ERROR ===');
      console.error('Error:', blobError);
      return new Response(JSON.stringify({
        error: 'Supabase Fetch Error',
        message: blobError instanceof Error ? blobError.message : String(blobError),
        fileKey: filename,
      }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  } catch (e) {
    console.error('Unexpected error:', e);
    return new Response('Internal Server Error', { status: 500 });
  }
}
