import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth error:', error);
      return NextResponse.redirect(`${origin}/sign-in`);
    }

    if (data.session) {
      return NextResponse.redirect(`${origin}/seek`);
    }
  }

  return NextResponse.redirect(`${origin}/sign-in`);
}
