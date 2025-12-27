import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

let supabase: any = null;

try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
} catch (error) {
  console.error('Failed to initialize Supabase:', error);
}

export async function GET() {
  if (!supabase) {
    console.error('Supabase not initialized');
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const { data: albums, error } = await supabase
      .from('albums')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching albums:', error);
      return Response.json([], { status: 200 });
    }

    // Fetch photos for each album
    const albumsWithPhotos = await Promise.all(
      (albums || []).map(async (album: any) => {
        const { data: photos, error: photosError } = await supabase
          .from('photos')
          .select('*')
          .eq('album_id', album.id)
          .order('uploaded_at', { ascending: false });

        if (photosError) {
          console.error(`Error fetching photos for album ${album.id}:`, photosError);
          return { ...album, photos: [] };
        }

        // Format photos for frontend
        const formattedPhotos = (photos || []).map((photo: any) => {
          let imageUrl: string;
          
          if (process.env.NODE_ENV === 'production') {
            imageUrl = `/api/photos/${photo.id}/image`;
          } else {
            // In development, serve directly from public directory
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

        return { ...album, photos: formattedPhotos };
      })
    );

    return Response.json(albumsWithPhotos || []);
  } catch (error) {
    console.error('Unexpected error fetching albums:', error);
    return Response.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  if (!supabase) {
    console.error('Supabase not initialized');
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const { name } = await request.json();

    if (!name || !name.trim()) {
      return Response.json({ error: 'Album name is required' }, { status: 400 });
    }

    const { data: album, error } = await supabase
      .from('albums')
      .insert([{ name: name.trim() }])
      .select()
      .single();

    if (error) {
      console.error('Error creating album:', error);
      return Response.json({ error: 'Failed to create album' }, { status: 500 });
    }

    return Response.json(album, { status: 201 });
  } catch (error) {
    console.error('Unexpected error creating album:', error);
    return Response.json({ error: 'Failed to create album' }, { status: 500 });
  }
}
