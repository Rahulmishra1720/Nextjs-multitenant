import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';
import { fetchUsersAsync, getAccessToken } from './app/_lib/util';



export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const user = getSession();
  const token = await getAccessToken();
  let users = fetchUsersAsync((token));

  const redirectUrl = new URL('/auth/login', req.url);
  redirectUrl.searchParams.set('callbackUrl', encodeURI(req.url));

  // All good, let the request through
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth/session).*)'],
};
