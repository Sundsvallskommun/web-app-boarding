import i18nConfig from '@app/i18nConfig';
import { NextRequest, NextResponse } from 'next/server';
import { i18nRouter } from 'next-i18n-router';

const PROTECTED = (pathname: string) => pathname !== '/login' && !pathname.startsWith('/api');

export async function proxy(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  if (PROTECTED(pathname)) {
    const cookieName = 'connect.sid';
    const token = req.cookies.get(cookieName)?.value ?? '';

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
      cache: 'no-cache',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Cookie: `${cookieName}=${encodeURIComponent(token)}`,
      },
    });

    if (response.status === 401) {
      const loginUrl = new URL('/login', origin);
      loginUrl.searchParams.set('path', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return i18nRouter(req, i18nConfig);
}

export const config = {
  matcher: '/((?!api|napi|static|.*\\..*|_next).*)',
};
