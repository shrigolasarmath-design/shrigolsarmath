import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
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

    // Format photos for frontend - always use blob_key endpoint
    const formattedPhotos = photos.map(photo => {
      // Check if photo has blob_key (should have one)
      if (!photo.blob_key) {
        console.warn(`Photo ${photo.id} missing blob_key - needs to be re-uploaded`);
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
  if (!supabase) {
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

    // Create blob_key for storing the file
    const blobKey = `${photoId}.${fileExt}`;

    if (process.env.NODE_ENV === 'production') {
      // In production, use Netlify Blobs
      console.log('=== UPLOADING TO NETLIFY BLOBS ===');
      console.log('blob_key:', blobKey);
      console.log('File size:', buffer.byteLength, 'bytes');
      console.log('Content type:', file.type);
      
      try {
        const { getStore } = await import('@netlify/blobs');
        const store = getStore('temple-photos');
        console.log('Store obtained');
        
        await store.set(blobKey, buffer, {
          metadata: { contentType: file.type }
        });
        console.log('=== BLOB UPLOADED SUCCESSFULLY ===');
        console.log('Netlify Blobs: Uploaded file with key:', blobKey);
      } catch (uploadError) {
        console.error('=== BLOB UPLOAD FAILED ===');
        console.error('Error:', uploadError);
        throw uploadError;
      }
    } else {
      // In development, save to file system
      const { writeFile } = await import('fs/promises');
      const { join } = await import('path');
      const { existsSync, mkdirSync } = await import('fs');

      const STORAGE_DIR = join(process.cwd(), 'public/uploads/photos');
      if (!existsSync(STORAGE_DIR)) {
        mkdirSync(STORAGE_DIR, { recursive: true });
      }

      const imagePath = join(STORAGE_DIR, blobKey);
      await writeFile(imagePath, Buffer.from(buffer));
      console.log('Dev: Saved file to:', imagePath);
    }

    // Insert photo record into database with blob_key
    const insertData: any = {
      album_id: parseInt(albumId),
      blob_key: blobKey,
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

    // Verify blob_key is present
    if (!photo.blob_key) {
      console.error('POST /api/photos - blob_key missing after insert:', photo);
      return Response.json({ error: 'Photo upload failed: blob_key not stored in database.' }, { status: 500 });
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
    return Response.json({ error: 'Upload failed: ' + (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!supabase) {
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const { photoId } = await request.json();

    // Get photo to find blob_key
    const { data: photo, error: fetchError } = await supabase
      .from('photos')
      .select('blob_key')
      .eq('id', photoId)
      .single();

    if (fetchError || !photo) {
      console.error('Photo not found:', fetchError);
      return Response.json({ error: 'Photo not found' }, { status: 404 });
    }

    console.log('Deleting photo:', photoId, 'with blob_key:', photo.blob_key);

    // Delete from blob storage first
    if (photo.blob_key) {
      if (process.env.NODE_ENV === 'production') {
        try {
          console.log('=== DELETING BLOB ===');
          console.log('Original blob_key from database:', photo.blob_key);
          
          const { getStore } = await import('@netlify/blobs');
          const store = getStore('temple-photos');
          
          let deleted = false;
          let successKey: string | null = null;
          
          // Try different key formats
          const keyFormats = [
            photo.blob_key,                                    // Direct: 1766916899764.jpeg
            `temple-photos/${photo.blob_key}`,                 // With folder: temple-photos/1766916899764.jpeg
            `temple-photos/photo-${photo.blob_key.split('.')[0]}`, // With photo- prefix: temple-photos/photo-1766916899764
            `photo-${photo.blob_key.split('.')[0]}`,          // Just photo- prefix: photo-1766916899764
          ];
          
          for (const key of keyFormats) {
            try {
              console.log('Attempting to delete with key:', key);
              await store.delete(key);
              console.log('✓ Successfully deleted blob with key:', key);
              successKey = key;
              deleted = true;
              break;
            } catch (err) {
              console.warn('✗ Delete failed for key:', key, 'Error:', err instanceof Error ? err.message : String(err));
              continue;
            }
          }
          
          if (!deleted) {
            console.warn('=== BLOB DELETION FAILED ===');
            console.warn('Could not delete blob with any key format');
            console.warn('Attempted keys:', keyFormats);
            // Continue with database deletion even if blob deletion fails
          } else {
            console.log('=== BLOB DELETED SUCCESSFULLY ===');
            console.log('Deleted with key:', successKey);
          }
        } catch (blobError) {
          console.error('Unexpected error during blob deletion:', blobError);
          // Continue with database deletion even if blob deletion fails
        }
      } else {
        // In development, delete from filesystem
        try {
          const { unlink } = await import('fs/promises');
          const { join } = await import('path');
          const imagePath = join(process.cwd(), 'public/uploads/photos', photo.blob_key);
          await unlink(imagePath);
          console.log('Deleted file from filesystem:', imagePath);
        } catch (fsError) {
          console.warn('Failed to delete file from filesystem:', fsError);
          // Continue with database deletion even if file deletion fails
        }
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
