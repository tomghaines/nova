import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber } from './newsletterController';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    await addSubscriber(email);

    return NextResponse.json({ message: 'Subscribed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error subscribing:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
