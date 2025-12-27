import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function GET() {
  if (!supabase) {
    return new Response(JSON.stringify({ error: 'Supabase not configured' }), { status: 500 });
  }

  try {
    const { data: numbers, error } = await supabase
      .from('admins')
      .select('phone_number');

    if (error) {
      console.error('Error fetching authorized numbers:', error);
      return new Response(JSON.stringify({ numbers: [] }), { status: 500 });
    }

    return new Response(JSON.stringify({ numbers: numbers.map(n => n.phone_number) }), { status: 200 });
  } catch (error) {
    console.error('Unexpected error fetching authorized numbers:', error);
    return new Response(JSON.stringify({ numbers: [] }), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!supabase) {
    return new Response(JSON.stringify({ error: 'Supabase not configured' }), { status: 500 });
  }

  const { phone } = await request.json();
  if (!/^\d{10}$/.test(phone)) {
    return new Response(JSON.stringify({ error: 'Invalid phone number' }), { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('admins')
      .insert([{ phone_number: phone }]);

    if (error) {
      console.error('Error adding authorized number:', error);
      return new Response(JSON.stringify({ error: 'Failed to add number' }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Unexpected error adding authorized number:', error);
    return new Response(JSON.stringify({ error: 'Failed to add number' }), { status: 500 });
  }
}
