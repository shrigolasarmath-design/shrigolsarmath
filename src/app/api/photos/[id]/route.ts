import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const { data, error } = await supabase
      .from('photos')
      .select('file_path')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching photo:', error);
      return new Response('Photo not found', { status: 404 });
    }

    const photoData = await fetch(data.file_path);
    return new Response(photoData.body, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Unexpected error serving photo:', error);
    return new Response('Error loading photo', { status: 500 });
  }
}
