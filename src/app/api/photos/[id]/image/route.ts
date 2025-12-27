import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!supabase) {
    return new Response('Supabase not configured', { status: 500 });
  }

  try {
    const { id: photoId } = await params;

    // Get photo metadata from database
    const { data: photo, error } = await supabase
      .from('photos')
      .select('blob_key, file_path')
      .eq('id', photoId)
      .single();

    if (error || !photo) {
      console.error('Photo not found:', error);
      return new Response('Photo not found', { status: 404 });
    }

    // Use blob_key (production) or extract filename from file_path (development/legacy)
    let filename: string | undefined;
    
    if (photo.blob_key) {
      filename = photo.blob_key;
    } else if (photo.file_path) {
      // Extract filename from full path like "/uploads/photos/1766858625550.png"
      filename = photo.file_path.split('/').pop();
    }

    if (!filename) {
      return new Response('Invalid file path', { status: 400 });
    }

    if (process.env.NODE_ENV === 'production') {
      // Retrieve from Netlify Blobs
      const { getStore } = await import('@netlify/blobs');
      const store = getStore('temple-photos');
      
      const data = await store.get(filename);
      
      if (!data) {
        console.error('Blob not found:', filename);
        return new Response('Image not found', { status: 404 });
      }

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

      return new Response(data, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      });
    } else {
      // In development, just redirect to the static file
      return Response.redirect(`/uploads/photos/${filename}`, 301);
    }
  } catch (error) {
    console.error('Error retrieving image:', error);
    return new Response('Failed to retrieve image', { status: 500 });
  }
}
