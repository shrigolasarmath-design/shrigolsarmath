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

    // Format photos for frontend
    const formattedPhotos = photos.map(photo => {
      let imageUrl: string;
      
      if (process.env.NODE_ENV === 'production') {
        // In production, only use API endpoint if blob_key exists
        // Old photos without blob_key won't show (they need to be re-uploaded)
        if (photo.blob_key) {
          imageUrl = `/api/photos/${photo.id}/image`;
        } else {
          // Old photo - no blob_key, can't serve in production
          imageUrl = '/placeholder.jpg';
          console.warn(`Photo ${photo.id} missing blob_key - needs to be re-uploaded for production`);
        }
      } else {
        // In development, serve directly from public directory
        // Use file_path (has full path), or blob_key with prefix
        let filePath = photo.file_path;
        
        if (!filePath && photo.blob_key) {
          filePath = `/uploads/photos/${photo.blob_key}`;
        }
        
        imageUrl = filePath || '/placeholder.jpg';
      }

      return {
        id: photo.id,
        imageUrl: imageUrl,
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
    
    // Store file and track key
    const storageKey = `${photoId}.${fileExt}`;  // Just the filename for blob storage
    const filePath = `/uploads/photos/${storageKey}`;  // Full path for development fallback
    
    if (process.env.NODE_ENV === 'production') {
      const { getStore } = await import('@netlify/blobs');
      const store = getStore('temple-photos');
      await store.set(storageKey, buffer, {
        metadata: { contentType: file.type }
      });
    } else {
      // In development, save to file system
      const { writeFile } = await import('fs/promises');
      const { join } = await import('path');
      const { existsSync, mkdirSync } = await import('fs');
      
      const STORAGE_DIR = join(process.cwd(), 'public/uploads/photos');
      if (!existsSync(STORAGE_DIR)) {
        mkdirSync(STORAGE_DIR, { recursive: true });
      }
      
      const imagePath = join(STORAGE_DIR, storageKey);
      await writeFile(imagePath, Buffer.from(buffer));
    }

    // Insert photo record into database with both blob_key and file_path
    const insertData: any = {
      album_id: parseInt(albumId),
      blob_key: storageKey,  // For production Blobs
      file_path: filePath,   // For development filesystem
      uploaded_at: new Date().toISOString()
    };

    if (caption) {
      insertData.caption = caption;
    }

    let photo = null;
    let insertError = null;

    // Debug: Log insertData before insert
    console.log('POST /api/photos - insertData:', insertData);

    // Try with both columns
    const { data: photoData, error } = await supabase
      .from('photos')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      // Debug: Log error details
      console.error('POST /api/photos - Supabase insert error:', error);
      // If error is about blob_key or caption column, try without them
      if (error.message && (error.message.includes('caption') || error.message.includes('blob_key'))) {
        console.log('Retrying insert without optional columns');
        const { data: photoRetry, error: retryError } = await supabase
          .from('photos')
          .insert([{
            album_id: parseInt(albumId),
            file_path: filePath,
            uploaded_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (retryError) {
          console.error('Error saving photo (retry):', retryError);
          insertError = retryError;
        } else {
          photo = photoRetry;
        }
      } else {
        console.error('Error saving photo:', error);
        insertError = error;
      }
    } else {
      photo = photoData;
    }

    if (!photo || insertError) {
      const errorMsg = insertError?.message || 'Failed to save photo';
      return Response.json({ error: errorMsg }, { status: 500 });
    }

    // Guarantee blob_key is present in production
    if (process.env.NODE_ENV === 'production') {
      if (!photo.blob_key) {
        console.error('POST /api/photos - blob_key missing after insert:', photo);
        return Response.json({ error: 'Photo upload failed: blob_key not stored in database.' }, { status: 500 });
      }
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
      imageUrl: process.env.NODE_ENV === 'production' ? `/api/photos/${photo.id}/image` : filePath
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

    // Get photo to find storage key
    const { data: photo, error: fetchError } = await supabase
      .from('photos')
      .select('blob_key, file_path')
      .eq('id', photoId)
      .single();

    if (fetchError || !photo) {
      console.error('Photo not found:', fetchError);
      return Response.json({ error: 'Photo not found' }, { status: 404 });
    }

    // Use blob_key (production) or extract filename from file_path (development/legacy)
    let filename: string | undefined;
    
    if (photo.blob_key) {
      filename = photo.blob_key;
    } else if (photo.file_path) {
      // Extract filename from full path like "/uploads/photos/1766858625550.png"
      filename = photo.file_path.split('/').pop();
    }
    
    if (filename) {
      if (process.env.NODE_ENV === 'production') {
        try {
          const { getStore } = await import('@netlify/blobs');
          const store = getStore('temple-photos');
          await store.delete(filename);
        } catch (blobError) {
          console.warn('Failed to delete blob:', blobError);
          // Continue with database deletion even if blob deletion fails
        }
      } else {
        // In development, delete from filesystem
        try {
          const { unlink } = await import('fs/promises');
          const { join } = await import('path');
          const imagePath = join(process.cwd(), 'public/uploads/photos', filename);
          await unlink(imagePath);
        } catch (fsError) {
          console.warn('Failed to delete file:', fsError);
          // Continue with database deletion even if file deletion fails
        }
      }
    }

    // Delete from database
    const { error } = await supabase
      .from('photos')
      .delete()
      .eq('id', photoId);

    if (error) {
      console.error('Error deleting photo from database:', error);
      return Response.json({ error: 'Failed to delete photo' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return Response.json({ error: 'Delete failed' }, { status: 500 });
  }
}
