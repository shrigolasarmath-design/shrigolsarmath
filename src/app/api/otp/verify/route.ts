import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  const { phone, otp } = await request.json();

  if (!phone || !otp) {
    return NextResponse.json({ error: 'Phone number and OTP are required' }, { status: 400 });
  }

  console.log('Verifying OTP for phone:', phone, 'with OTP:', otp);

  try {
    const { data, error } = await supabase
      .from('otps')
      .select('*')
      .eq('phone_number', phone)
      .eq('otp_code', otp)
      .gte('expires_at', new Date().toISOString())
      .single();

    console.log('Database query result:', data, 'Error:', error);

    if (error || !data) {
      return NextResponse.json({ error: 'Invalid OTP or phone number' }, { status: 401 });
    }

    // OTP verified successfully
    console.log('Redirecting to admin dashboard after OTP verification');
    return NextResponse.json({ success: true, redirect: '/admin/dashboard' });
  } catch (err) {
    console.error('Error verifying OTP:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}