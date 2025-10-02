// import createMiddleware from 'next-intl/middleware';

// Simple middleware that redirects to /en for now
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // If accessing root, redirect to /en
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/en', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  // Match only root path
  matcher: ['/']
};
