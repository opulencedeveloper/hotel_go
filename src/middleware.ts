import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware, apiAuthMiddleware } from './middleware/auth';
import { geoMiddleware } from './middleware/geo';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip geo detection for API routes and static files
  if (pathname.startsWith('/api/')) {
    return apiAuthMiddleware(request);
  }

  // For homepage, run geo detection first, then auth
  if (pathname === '/') {
    const geoResponse = geoMiddleware(request);
    // If geo middleware returns a redirect or modified response, use it
    // Otherwise, continue with auth middleware
    return geoResponse;
  }

  // Handle other page routes with auth
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































