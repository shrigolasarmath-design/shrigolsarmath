import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

/**
 * Generic image upload endpoint for all image types
 * Usage: POST /api/uploads?bucket=<bucket_name>&type=<image_type>
 * 
 * Supported buckets:
 * - hero_images: Hero carousel images
 * - section_backgrounds: Background images for sections
 * - banner_assets: Banner logo and banner images
 */
export async function POST(request: Request) {
  if (!supabaseAdmin) {
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const url = new URL(request.url);
    const bucketName = url.searchParams.get('bucket');
    const imageType = url.searchParams.get('type');

    if (!bucketName) {
      return Response.json({ error: 'bucket parameter is required' }, { status: 400 });
    }

    // Validate bucket name
    const validBuckets = ['hero_images', 'section_backgrounds', 'banner_assets', 'album_images', 'page_backgrounds'];
    if (!validBuckets.includes(bucketName)) {
      return Response.json({ error: 'Invalid bucket name' }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return Response.json({ error: 'File must be an image' }, { status: 400 });
    }

    const fileExt = file.type.split('/')[1] || 'jpg';
    const timestamp = Date.now();
    const fileKey = `${imageType ? imageType + '_' : ''}${timestamp}.${fileExt}`;
    const buffer = await file.arrayBuffer();

    console.log(`=== UPLOADING TO ${bucketName} ===`);
    console.log('file_key:', fileKey);
    console.log('File size:', buffer.byteLength, 'bytes');
    console.log('Content type:', file.type);

    const { data, error } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(fileKey, buffer, {
        contentType: file.type,
      });

    if (error) {
      console.error('Upload failed:', error);
      return Response.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
    }

    console.log('Upload successful. File key:', fileKey);

    // Insert metadata into the database
    let tableName;
    switch (bucketName) {
      case 'hero_images':
        tableName = 'hero_images';
        break;
      case 'section_backgrounds':
        tableName = 'section_backgrounds';
        break;
      case 'banner_assets':
        tableName = 'banner_assets';
        break;
      case 'album_images':
        tableName = 'album_images';
        break;
      case 'page_backgrounds':
        tableName = 'page_backgrounds';
        break;
      default:
        tableName = null;
    }

    if (tableName) {
      const { error: dbError } = await supabaseAdmin
        .from(tableName)
        .insert({
          url: `/api/image?bucket=${bucketName}&key=${fileKey}`,
          title: imageType || null,
          description: null,
          album_id: bucketName === 'album_images' ? imageType : null,
          page_name: bucketName === 'page_backgrounds' ? imageType : null,
        });

      if (dbError) {
        console.error('Database insert failed:', dbError);
        return Response.json({ error: 'Database insert failed: ' + dbError.message }, { status: 500 });
      }

      console.log('Metadata inserted into table:', tableName);
    }

    return Response.json({
      success: true,
      fileKey: fileKey,
      bucket: bucketName,
      url: `/api/image?bucket=${bucketName}&key=${fileKey}`
    }, { status: 201 });

  } catch (error) {
    console.error('Upload error:', error);
    return Response.json({ error: 'Upload failed: ' + String(error) }, { status: 500 });
  }
}
