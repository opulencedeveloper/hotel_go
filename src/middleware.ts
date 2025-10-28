import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware, apiAuthMiddleware } from './middleware/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle API routes
  if (pathname.startsWith('/api/')) {
    return apiAuthMiddleware(request);
  }

  // Handle page routes
  return authMiddleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
















