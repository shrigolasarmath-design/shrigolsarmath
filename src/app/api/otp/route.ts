import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { phone } = await request.json();

  if (!phone) {
    return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
  }

  // Placeholder for future logic
  console.log('Received phone number:', phone);

  return NextResponse.json({ success: true, message: 'Request received' });
}
