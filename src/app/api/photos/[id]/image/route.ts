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
        
        console.log('Calling store.get() with key:', filename);
        const data = await store.get(filename);
        console.log('store.get() returned, data type:', typeof data, 'data exists:', !!data);
        
        if (!data) {
          console.error('=== BLOB NOT FOUND ===');
          console.error('Blob key that failed:', filename);
          console.error('Available keys in store would need to be listed separately');
          return new Response(JSON.stringify({ error: 'Blob not found', blobKey: filename }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }
        
        console.log('Blob found! Size:', (data as ArrayBuffer).byteLength, 'bytes');

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
          headers: {
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
}
