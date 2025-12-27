import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function GET() {
  if (!supabase) {
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const { data: albums, error } = await supabase
      .from('albums')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching albums:', error);
      return Response.json({ error: 'Failed to fetch albums' }, { status: 500 });
    }

    return Response.json(albums || []);
  } catch (error) {
    console.error('Unexpected error fetching albums:', error);
    return Response.json({ error: 'Failed to fetch albums' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!supabase) {
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const { name } = await request.json();

    if (!name || !name.trim()) {
      return Response.json({ error: 'Album name is required' }, { status: 400 });
    }

    const { data: album, error } = await supabase
      .from('albums')
      .insert([{ name: name.trim(), photos: [] }])
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
