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

    console.log('=== IMAGE FETCH DEBUG ===');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Photo ID:', photoId);

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

    console.log('Photo found:', { blob_key: photo.blob_key, file_path: photo.file_path });

    // Get blob_key or extract from file_path if not available
    let filename: string | undefined = photo.blob_key;
    
    if (!filename && photo.file_path) {
      // Extract filename from path like "/uploads/photos/1766858625550.png"
      filename = photo.file_path.split('/').pop();
      console.log('Extracted filename from file_path:', filename);
    }

    if (!filename) {
      console.error('Photo missing both blob_key and file_path - Photo ID:', photoId);
      return new Response('Photo file not found', { status: 400 });
    }

    console.log('Using filename:', filename);

    if (process.env.NODE_ENV === 'production') {
      // Retrieve from Netlify Blobs only
      console.log('=== PRODUCTION MODE - NETLIFY BLOBS ===');
      console.log('Photo ID:', photoId);
      console.log('Looking for blob_key:', filename);
      
      try {
        console.log('Importing @netlify/blobs...');
        const { getStore } = await import('@netlify/blobs');
        console.log('@netlify/blobs imported successfully');
        
        console.log('Getting store: temple-photos');
        const store = getStore('temple-photos');
        console.log('Store obtained');
        
        let data: ArrayBuffer | null = null;
        let successKey: string | null = null;
        
        // Try different key formats
        const keyFormats = [
          filename,                                    // Direct: 1766916899764.jpeg
          `temple-photos/${filename}`,                 // With folder: temple-photos/1766916899764.jpeg
          `temple-photos/photo-${filename.split('.')[0]}`, // With photo- prefix: temple-photos/photo-1766916899764
          `photo-${filename.split('.')[0]}`,          // Just photo- prefix: photo-1766916899764
        ];
        
        for (const key of keyFormats) {
          try {
            console.log('Trying key format:', key);
            data = await store.get(key);
            if (data) {
              successKey = key;
              console.log('✓ Successfully retrieved blob with key:', key);
              break;
            }
          } catch (err) {
            console.log('✗ Key format failed:', key, 'Error:', err instanceof Error ? err.message : String(err));
            continue;
          }
        }
        
        if (!data) {
          console.error('=== BLOB NOT FOUND ===');
          console.error('Blob not found with any key format');
          console.error('Attempted keys:', keyFormats);
          return new Response(JSON.stringify({ 
            error: 'Blob not found', 
            blobKey: filename,
            attemptedKeys: keyFormats 
          }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }
        
        console.log('Blob found! Size:', (data as ArrayBuffer).byteLength, 'bytes', 'Key used:', successKey);

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

        console.log('Returning blob with content-type:', contentType);
        return new Response(data, {
          headers:
           {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable'
          }
        });
      } catch (blobError) {
        console.error('=== NETLIFY BLOBS EXCEPTION ===');
        console.error('Error type:', blobError instanceof Error ? blobError.constructor.name : typeof blobError);
        console.error('Error message:', blobError instanceof Error ? blobError.message : String(blobError));
        console.error('Full error:', blobError);
        return new Response(JSON.stringify({ 
          error: 'Netlify Blobs Error', 
          message: blobError instanceof Error ? blobError.message : String(blobError),
          blobKey: filename
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
    } else {
      // In development, serve from public directory
      return Response.redirect(`/uploads/photos/${filename}`, 301);
    }
  } catch (e) {
    console.error('Unexpected error:', e);
    return new Response('Internal Server Error', { status: 500 });
  }
}
