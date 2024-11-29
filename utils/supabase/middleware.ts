import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { NextRequest } from 'next/server';

export const updateSession = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const res = NextResponse.next();

  if (
    pathname.startsWith('/auth/callback') ||
    pathname.startsWith('/api/') ||
    pathname === '/home' ||
    pathname === '/'
  ) {
    return res;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => {
          return request.cookies.getAll();
        },
        setAll: (cookies) => {
          cookies.forEach(({ name, value, ...options }) => {
            request.cookies.set({ name, value, ...options });
            res.cookies.set({ name, value, ...options });
          });
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();
  const isAuthPage =
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up') ||
    pathname.startsWith('/forgot-password');

  if (isAuthPage) {
    return user ? NextResponse.redirect(new URL('/seek', request.url)) : res;
  }

  return user ? res : NextResponse.redirect(new URL('/sign-in', request.url));
};
