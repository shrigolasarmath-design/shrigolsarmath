import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Use service role key for server-side operations (storage uploads, etc)
const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Use anon key for client-side safe queries
const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

interface PhotoData {
  id: string;
  caption: string;
  uploadedAt: string;
  fileExt?: string;
}

const isDev = process.env.NODE_ENV === 'development';
let devPhotos: PhotoData[] = [];

export async function GET() {
  if (!supabase) {
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const { data: photos, error } = await supabase
      .from('photos')
      .select('*')
      .order('uploaded_at', { ascending: false });

    console.log('GET /api/photos - Raw response:', { photosCount: photos?.length, error });

    if (error) {
      console.error('Error fetching photos:', error);
      return Response.json({ error: 'Failed to load photos', details: error }, { status: 500 });
    }

    if (!photos) {
      console.warn('GET /api/photos - No photos returned from database');
      return Response.json([]);
    }

    // Format photos for frontend
    const formattedPhotos = photos.map(photo => {
      // Check if photo has file_key (should have one)
      if (!photo.file_key) {
        console.warn(`Photo ${photo.id} missing file_key - needs to be re-uploaded`);
        return {
          id: photo.id,
          imageUrl: '/placeholder.jpg',
          caption: photo.caption || 'Untitled',
          uploadedAt: photo.uploaded_at
        };
      }

      return {
        id: photo.id,
        imageUrl: `/api/photos/${photo.id}/image`,
        caption: photo.caption || 'Untitled',
        uploadedAt: photo.uploaded_at
      };
    });

    console.log('GET /api/photos - Formatted response count:', formattedPhotos.length);
    return Response.json(formattedPhotos);
  } catch (error) {
    console.error('Unexpected error loading photos:', error);
    return Response.json({ error: 'Failed to load photos', details: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!supabaseAdmin || !supabase) {
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const caption = formData.get('caption') as string;
    const albumId = formData.get('albumId') as string;

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!albumId) {
      return Response.json({ error: 'Album ID is required' }, { status: 400 });
    }


    const fileExt = file.type.split('/')[1] || 'jpg';
    const photoId = Date.now().toString();
    const buffer = await file.arrayBuffer();

    // Create file_key for storing the file
    const fileKey = `${photoId}.${fileExt}`;
    const bucketName = 'album_images';

    // Always upload to Supabase bucket (both dev and production)
    console.log('=== UPLOADING TO SUPABASE STORAGE ===');
    console.log('bucket:', bucketName);
    console.log('file_key:', fileKey);
    console.log('File size:', buffer.byteLength, 'bytes');
    console.log('Content type:', file.type);

    try {
      // Use service role key for storage uploads (bypasses RLS)
      const { data, error } = await supabaseAdmin.storage
        .from(bucketName)
        .upload(fileKey, buffer, {
          contentType: file.type,
        });

      if (error) {
        console.error('=== SUPABASE UPLOAD FAILED ===');
        console.error('Error:', error);
        throw error;
      }

      console.log('=== SUPABASE UPLOAD SUCCESSFUL ===');
      console.log('Uploaded file with key:', fileKey);
    } catch (uploadError) {
      console.error('=== SUPABASE UPLOAD ERROR ===');
      console.error('Error:', uploadError);
      throw uploadError;
    }

    // Insert photo record into database with file_key
    const insertData: any = {
      album_id: parseInt(albumId),
      file_key: fileKey,
      uploaded_at: new Date().toISOString(),
      caption: caption || 'Untitled'
    };

    // Log insertData for debugging
    console.log('POST /api/photos - inserting into Supabase:', insertData);

    const { data: photo, error } = await supabase
      .from('photos')
      .insert([insertData])
      .select()
      .single();

    if (error || !photo) {
      console.error('POST /api/photos - Supabase insert error:', error);
      return Response.json({ error: error?.message || 'Failed to save photo' }, { status: 500 });
    }

    // Verify file_key is present
    if (!photo.file_key) {
      console.error('POST /api/photos - file_key missing after insert:', photo);
      return Response.json({ error: 'Photo upload failed: file_key not stored in database.' }, { status: 500 });
    }

    return Response.json({
      id: photo.id,
      caption: caption || 'Untitled',
      fileExt,
      uploadedAt: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      imageUrl: `/api/photos/${photo.id}/image`
    }, { status: 201 });
  } catch (error) {
    console.error('Photo upload error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return Response.json({ error: 'Upload failed: ' + errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!supabaseAdmin || !supabase) {
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const { photoId } = await request.json();

    // Get photo to find file_key
    const { data: photo, error: fetchError } = await supabase
      .from('photos')
      .select('file_key')
      .eq('id', photoId)
      .single();

    if (fetchError || !photo) {
      console.error('Photo not found:', fetchError);
      return Response.json({ error: 'Photo not found' }, { status: 404 });
    }

    console.log('Deleting photo:', photoId, 'with file_key:', photo.file_key);

    // Delete from Supabase storage using service role key
    if (photo.file_key) {
      try {
        console.log('=== DELETING FROM SUPABASE STORAGE ===');
        console.log('bucket: album_images');
        console.log('file_key:', photo.file_key);

        const { error } = await supabaseAdmin.storage
          .from('album_images')
          .remove([photo.file_key]);

        if (error) {
          console.warn('Failed to delete file from Supabase:', error);
          // Continue with database deletion even if blob deletion fails
        } else {
          console.log('Deleted file from Supabase:', photo.file_key);
        }
      } catch (blobError) {
        console.error('Unexpected error during Supabase file deletion:', blobError);
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('photos')
      .delete()
      .eq('id', photoId);

    if (deleteError) {
      console.error('Error deleting photo from database:', deleteError);
      return Response.json({ error: 'Failed to delete photo: ' + deleteError.message }, { status: 500 });
    }

    console.log('Successfully deleted photo:', photoId);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return Response.json({ error: 'Delete failed: ' + (error as Error).message }, { status: 500 });
  }
}
