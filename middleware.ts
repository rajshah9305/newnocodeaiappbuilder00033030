import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Add custom middleware logic here
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    // Allow access to auth pages when not authenticated
    if (!token && (pathname.startsWith('/auth') || pathname === '/')) {
      return NextResponse.next();
    }

    // Redirect unauthenticated users to signin
    if (!token && pathname !== '/') {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // Add security headers
    const response = NextResponse.next();
    
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    
    // Add CORS headers for API routes
    if (pathname.startsWith('/api/')) {
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Always allow access to public routes
        const publicRoutes = [
          '/',
          '/auth/signin',
          '/auth/signup',
          '/auth/error',
          '/api/auth',
          '/favicon.ico',
          '/_next',
          '/images'
        ];

        // Check if current path is public
        const isPublicRoute = publicRoutes.some(route => 
          pathname.startsWith(route) || pathname === route
        );

        if (isPublicRoute) {
          return true;
        }

        // Require authentication for protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
};