import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber } from '@/utils/newsletter/controller';
import supabase from '@/utils/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Check if the email already exists in the database
    const { data, error: fetchError } = await supabase
      .from('subscribers')
      .select('email')
      .eq('email', email)
      .single();

    if (data) {
      // Email already exists
      return NextResponse.json(
        { message: "You've already signed up" },
        { status: 409 }
      );
    }

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    await addSubscriber(email);
    return NextResponse.json(
      { message: 'Subscribed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error adding subscriber:', error);

    // Handle unique constraint violation (Supabase error code 23505)
    if (error.code === '23505') {
      return NextResponse.json(
        { message: "You've already signed up" },
        { status: 409 }
      );
    }
    
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
