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

    console.log('Fetching photo image - Photo ID:', photoId);

    // Get photo metadata from database
    const { data: photo, error } = await supabase
      .from('photos')
      .select('blob_key, file_path')
      .eq('id', photoId)
      .single();

    if (error || !photo) {
      console.error('Photo not found in database - Photo ID:', photoId, 'Error:', error);
      return new Response('Photo not found', { status: 404 });
    }

    console.log('Photo found in database:', { id: photoId, blob_key: photo.blob_key, file_path: photo.file_path });

    // Use blob_key (production) or extract filename from file_path (development/legacy)
    let filename: string | undefined;
    
    if (photo.blob_key) {
      filename = photo.blob_key;
      console.log('Using blob_key as filename:', filename);
    } else if (photo.file_path) {
      // Extract filename from full path like "/uploads/photos/1766858625550.png"
      filename = photo.file_path.split('/').pop();
      console.log('Using extracted filename from file_path:', filename);
    }

    if (!filename) {
      console.error('No filename available for photo:', photoId);
      return new Response('Invalid file path', { status: 400 });
    }

    if (process.env.NODE_ENV === 'production') {
      // Retrieve from Netlify Blobs
      const { getStore } = await import('@netlify/blobs');
      const store = getStore('temple-photos');
      
      console.log('Fetching blob from Netlify Blobs - Photo ID:', photoId, 'Filename:', filename);
      
      let data;
      try {
        data = await store.get(filename);
      } catch (blobError) {
        console.error('Netlify Blobs Error - Filename:', filename, 'Error:', blobError);
        return new Response(`Netlify Blobs Error: ${(blobError as Error).message}`, { status: 500 });
      }
      
      if (!data) {
        console.warn('Blob not found in Netlify Blobs for filename:', filename);
        console.warn('Photo record - blob_key:', photo.blob_key, 'file_path:', photo.file_path);
        return new Response('Image not available in Netlify Blobs', { status: 404 });
      }
      
      console.log('Successfully retrieved blob from Netlify Blobs - Size:', data.length, 'bytes');

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
