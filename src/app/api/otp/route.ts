import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import twilio from 'twilio';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(request: NextRequest) {
  const { phone } = await request.json();

  if (!phone) {
    return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
  }

  try {
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes expiry

    console.log('Generated OTP:', otp, 'for phone:', phone);

    // Insert OTP into database
    const { data, error } = await supabase
      .from('otps')
      .insert([
        {
          phone_number: phone,
          otp_code: otp,
          expires_at: expiresAt,
        },
      ])
      .select();

    if (error) {
      console.error('Error inserting OTP:', error);
      return NextResponse.json({ error: 'Failed to generate OTP' }, { status: 500 });
    }

    console.log('OTP inserted:', data);

    // Send OTP via Twilio (optional - remove if not using SMS)
    try {
      await twilioClient.messages.create({
        body: `Your OTP is: ${otp}. Valid for 5 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: `+91${phone}`,
      });
      console.log('OTP sent via SMS to:', phone);
    } catch (smsError) {
      console.warn('Failed to send SMS, but OTP was stored:', smsError);
      // Don't fail the request if SMS fails - OTP is still in database
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
