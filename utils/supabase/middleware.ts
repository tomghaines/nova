// middleware.ts in utils/supabase
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const updateSession = async (request: NextRequest) => {
  const res = NextResponse.next();

  // Early return for callback route
  if (request.nextUrl.pathname.startsWith('/auth/callback')) {
    return res;
  }

  // Create supabase server client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // Set cookie in both request and response
          request.cookies.set({
            name,
            value,
            ...options
          });
          res.cookies.set({
            name,
            value,
            ...options
          });
        },
        remove(name: string, options: any) {
          request.cookies.delete({
            name,
            ...options
          });
          res.cookies.delete({
            name,
            ...options
          });
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const isAuthPage =
    request.nextUrl.pathname.startsWith('/sign-in') ||
    request.nextUrl.pathname.startsWith('/sign-up') ||
    request.nextUrl.pathname.startsWith('/forgot-password');

  const isPublicPage =
    request.nextUrl.pathname === '/home' || request.nextUrl.pathname === '/';

  if (isAuthPage && user) {
    return NextResponse.redirect(new URL('/seek', request.url));
  }

  if (!isAuthPage && !isPublicPage && !user) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (request.nextUrl.pathname === '/' && user) {
    return NextResponse.redirect(new URL('/seek', request.url));
  }

  return res;
};
