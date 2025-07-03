import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateCustomerToken } from '@/lib/shopify/customer-auth';
import { applySecurityHeaders, getCSPHeader } from '@/lib/security/headers';

// Protected routes that require authentication
const protectedRoutes = [
  '/account',
  '/account/profile',
  '/account/orders',
  '/account/addresses',
  '/account/settings',
];

// Routes that should redirect to account if already authenticated
const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if route needs protection
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  const isAuthRoute = authRoutes.includes(pathname);
  
  // Get customer token from cookies
  const token = request.cookies.get('customer-token');
  const tokenExpires = request.cookies.get('customer-token-expires');
  
  // Check if we need to validate the token
  if (token && tokenExpires) {
    // Check if token is expired
    const expiryDate = new Date(tokenExpires.value);
    if (expiryDate <= new Date()) {
      // Token is expired, clear cookies and redirect if on protected route
      const response = isProtectedRoute 
        ? NextResponse.redirect(new URL('/login', request.url))
        : NextResponse.next();
        
      response.cookies.delete('customer-token');
      response.cookies.delete('customer-token-expires');
      
      return response;
    }
    
    // For protected routes, validate token with Shopify
    if (isProtectedRoute) {
      const isValid = await validateCustomerToken(token.value);
      
      if (!isValid) {
        // Invalid token, clear cookies and redirect to login
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('customer-token');
        response.cookies.delete('customer-token-expires');
        
        // Add redirect parameter to return user to intended page after login
        response.headers.set('x-redirect-to', pathname);
        
        return response;
      }
    }
    
    // If authenticated and trying to access auth routes, redirect to account
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/account', request.url));
    }
  } else if (isProtectedRoute) {
    // No token and trying to access protected route
    const loginUrl = new URL('/login', request.url);
    
    // Add redirect parameter to return user to intended page after login
    if (pathname !== '/account') {
      loginUrl.searchParams.set('redirectTo', pathname);
    }
    
    return NextResponse.redirect(loginUrl);
  }
  
  // Create response
  let response = NextResponse.next();
  
  // Apply security headers
  response = applySecurityHeaders(response);
  
  // Apply Content Security Policy
  response.headers.set('Content-Security-Policy', getCSPHeader());
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};