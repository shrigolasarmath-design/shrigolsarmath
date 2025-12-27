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
      .select('*');

    if (error) {
      console.error('Error fetching photos:', error);
      return Response.json({ error: 'Failed to load photos' }, { status: 500 });
    }

    return Response.json(photos);
  } catch (error) {
    console.error('Unexpected error loading photos:', error);
    return Response.json({ error: 'Failed to load photos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const caption = formData.get('caption') as string;

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileExt = file.type.split('/')[1] || 'jpg';
    const photoId = Date.now().toString();
    const buffer = await file.arrayBuffer();

    if (isDev) {
      // In development, save to file system
      const { writeFile } = await import('fs/promises');
      const { join } = await import('path');
      const { existsSync, mkdirSync } = await import('fs');
      
      const STORAGE_DIR = join(process.cwd(), 'public/uploads/photos');
      if (!existsSync(STORAGE_DIR)) {
        mkdirSync(STORAGE_DIR, { recursive: true });
      }
      
      const imagePath = join(STORAGE_DIR, `${photoId}.${fileExt}`);
      await writeFile(imagePath, Buffer.from(buffer));
      
      const photoData: PhotoData = {
        id: photoId,
        caption,
        fileExt,
        uploadedAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };
      
      devPhotos.push(photoData);
      
      return Response.json({
        id: photoId,
        caption,
        uploadedAt: photoData.uploadedAt,
        imageUrl: `/uploads/photos/${photoId}.${fileExt}`
      });
    } else {
      // In production, use Netlify Blobs
      const { getStore } = await import('@netlify/blobs');
      const store = getStore('temple-photos');
      
      // Save image data
      await store.set(`photo-${photoId}`, buffer, {
        metadata: { contentType: file.type }
      });
      
      // Update index
      let photosIndex = await store.get('index', { type: 'json' }) as PhotoData[] | null;
      if (!photosIndex) photosIndex = [];
      
      const photoData: PhotoData = {
        id: photoId,
        caption,
        fileExt,
        uploadedAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };
      
      photosIndex.push(photoData);
      await store.setJSON('index', photosIndex);
      
      return Response.json({
        id: photoId,
        caption,
        uploadedAt: photoData.uploadedAt,
        imageUrl: `/api/photos/${photoId}`
      });
    }
  } catch (error) {
    console.error('Photo upload error:', error);
    return Response.json({ error: 'Upload failed: ' + (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { photoId } = await request.json();

    if (isDev) {
      // In development, remove from in-memory storage and file system
      devPhotos = devPhotos.filter(p => p.id !== photoId);
      
      const { unlink } = await import('fs/promises');
      const { join } = await import('path');
      const imagePath = join(process.cwd(), 'public/uploads/photos', `${photoId}.jpg`);
      try {
        await unlink(imagePath);
      } catch {
        // File might not exist
      }
    } else {
      // In production, use Netlify Blobs
      const { getStore } = await import('@netlify/blobs');
      const store = getStore('temple-photos');
      
      // Remove from index
      let photosIndex = await store.get('index', { type: 'json' }) as PhotoData[] | null;
      if (photosIndex) {
        photosIndex = photosIndex.filter(p => p.id !== photoId);
        await store.setJSON('index', photosIndex);
      }
      
      // Remove image data
      await store.delete(`photo-${photoId}`);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return Response.json({ error: 'Delete failed' }, { status: 500 });
  }
}
