import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith('/login');
  const isPublic = pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.');

  if (isPublic) return NextResponse.next();

  // 1. Guest: Redirect to Login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 2. Logged In: Redirect to Dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"] };