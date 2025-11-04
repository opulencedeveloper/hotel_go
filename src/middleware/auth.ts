import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';

// Define the routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/reservations',
  '/front-desk',
  '/room-management',
  '/services',
  '/facilities',
  '/folio',
  '/pos',
  '/kitchen',
  '/housekeeping',
  '/staff',
  '/yield',
  '/accounting',
  '/crm',
  '/procurement',
  '/analytics',
  '/reports',
  '/security',
  '/backup',
  '/settings',
  '/admin'
];


export async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Get the token from cookies
  const token = request.cookies.get('auth-token')?.value;

  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify the JWT token
    const decoded = verifyJWT(token, process.env.JWT_SECRET || 'your-secret-key');
    
    if (!decoded) {
      throw new Error('Invalid token');
    }
    
    // For now, skip role-based access check to prevent redirect loops
    // Role-based access will be handled by the ProtectedRoute component
    return NextResponse.next();
  } catch (error) {
    // Invalid token, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

// API route protection
export async function apiAuthMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth for public API routes
  const publicApiRoutes = [
    '/api/v1/auth/login',
   // "/api/v1/admin/create",
   "/api/v1/payment/initiate",
   "/api/v1/payment/verify",
   "/api/v1/payment/webhook",
   "/api/v1/admin/create-plan",
   "/api/v1/plans",
    '/api/v1/auth/register',
    '/api/v1/auth/forgot-password',
    '/api/v1/auth/verify-email',
    '/api/v1/auth/resend-email-verify-otp'
  ];

  if (publicApiRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check for auth token in httpOnly cookie
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Missing authentication token' },
      { status: 401 }
    );
  }

  try {
    // Verify the JWT token
    const decoded = verifyJWT(token, process.env.JWT_SECRET || 'your-secret-key');
    
    if (!decoded) {
      throw new Error('Invalid token');
    }
    
    // Add user info to request headers for API routes to use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.userId);
    requestHeaders.set('x-user-role', decoded.userRole);
    requestHeaders.set('x-hotel-id', decoded.hotelId || ''); // Use hotelId from JWT token
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Invalid token' },
      { status: 401 }
    );
  }
}

// API access control - All authenticated users have full access
export function checkApiAccess(userRole: string, endpoint: string): boolean {
  return true;
}
