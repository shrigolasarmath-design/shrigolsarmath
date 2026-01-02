import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

/**
 * Generic image serving endpoint
 * Usage: GET /api/image?bucket=<bucket_name>&key=<file_key>
 */
export async function GET(request: Request) {
  if (!supabaseAdmin) {
    return new Response('Supabase not configured', { status: 500 });
  }

  try {
    const url = new URL(request.url);
    const bucketName = url.searchParams.get('bucket');
    const fileKey = url.searchParams.get('key');

    if (!bucketName || !fileKey) {
      return new Response('bucket and key parameters are required', { status: 400 });
    }

    const validBuckets = ['hero_images', 'section_backgrounds', 'banner_assets', 'album_images'];
    if (!validBuckets.includes(bucketName)) {
      return new Response('Invalid bucket name', { status: 400 });
    }

    console.log(`=== IMAGE FETCH ===`);
    console.log('bucket:', bucketName);
    console.log('key:', fileKey);

    const { data, error } = await supabaseAdmin.storage
      .from(bucketName)
      .download(fileKey);

    if (error || !data) {
      console.error('Download failed:', error);
      return new Response('Image not found', { status: 404 });
    }

    // Determine content type from filename
    const contentType = fileKey.endsWith('.png')
      ? 'image/png'
      : fileKey.endsWith('.jpg') || fileKey.endsWith('.jpeg')
      ? 'image/jpeg'
      : fileKey.endsWith('.gif')
      ? 'image/gif'
      : fileKey.endsWith('.webp')
      ? 'image/webp'
      : 'image/jpeg';

    console.log('File found! Size:', data.size, 'bytes');
    console.log('Content-type:', contentType);

    return new Response(data, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // 1 year cache
      },
    });

  } catch (error) {
    console.error('Error serving image:', error);
    return new Response('Failed to serve image', { status: 500 });
  }
}
