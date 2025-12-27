import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!supabase) {
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const { id } = await params;
    const { name, photos } = await request.json();

    const { data: album, error } = await supabase
      .from('albums')
      .update({ name, photos })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating album:', error);
      return Response.json({ error: 'Failed to update album' }, { status: 500 });
    }

    return Response.json(album);
  } catch (error) {
    console.error('Unexpected error updating album:', error);
    return Response.json({ error: 'Failed to update album' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!supabase) {
    return Response.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  try {
    const { id } = await params;

    const { error } = await supabase
      .from('albums')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting album:', error);
      return Response.json({ error: 'Failed to delete album' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Unexpected error deleting album:', error);
    return Response.json({ error: 'Failed to delete album' }, { status: 500 });
  }
}
