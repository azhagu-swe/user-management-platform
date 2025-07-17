// src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Matches files with extensions (e.g., .svg, .png, .jpg, .ico)
const PUBLIC_FILE_REGEX = /\.(.*)$/;

// --- START: CUSTOMIZE THESE FOR YOUR APP ---

// 1. Pages that unauthenticated users ARE ALLOWED to access.
//    Everything else requires authentication.
const PUBLICLY_ACCESSIBLE_PATHS = [
  '/signin',
  '/forgot-password',
  '/reset-password',   // Will also match /reset-password/[token] due to startsWith
  '/request-access',
  '/unauthorized',     // Should be viewable if someone is sent here
  '/maintenance',  
  '/signup', 
  // '/'   // Should be viewable if the site is in maintenance mode
  // IMPORTANT: If you have a public landing page at '/', add '/' here.
  // If '/' is your main dashboard (protected), then DO NOT add it here.
];

// 2. Subset of PUBLICLY_ACCESSIBLE_PATHS: These are pages that an *authenticated* user
//    should be redirected AWAY from (to their main app page).
//    Typically, these are pages for initiating login, signup, or password recovery.
const AUTH_FLOW_INITIATION_PAGES = [
  '/signin',
  '/forgot-password',
  '/reset-password',
  '/request-access',
  // Note: '/unauthorized' and '/maintenance' are NOT listed here, as an authenticated user
  // might legitimately need to see these pages if directed there.
  // Note: '/signup' is not here because you previously indicated it's a protected route.
];

// 3. The default page for authenticated users (e.g., their dashboard).
//    This is where they're sent if they try to access an AUTH_FLOW_INITIATION_PAGE
//    while already logged in.
//    If your main app page after login is the root '/', set this to '/'.
const DEFAULT_AUTHENTICATED_REDIRECT = '/'; // << CUSTOMIZE: e.g., '/dashboard' or '/app'

// 4. The page where unauthenticated users are sent if they try to access a protected route.
const SIGNIN_PATH = '/signin';

// --- END: CUSTOMIZE THESE FOR YOUR APP ---

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // A. IMPORTANT: Replace 'your-auth-token-cookie-name' with the actual name of your cookie.
  const authToken = request.cookies.get('your-auth-token-cookie-name')?.value;

  // B. Skip middleware for Next.js internal paths, API routes, and public files.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||    // Your backend API routes in src/app/api/
    pathname.startsWith('/static') || // If you serve static assets from /public/static
    PUBLIC_FILE_REGEX.test(pathname)
  ) {
    return NextResponse.next();
  }

  const isPubliclyAccessible = PUBLICLY_ACCESSIBLE_PATHS.some(route => pathname.startsWith(route));
  const isAuthFlowInitiationPage = AUTH_FLOW_INITIATION_PAGES.some(route => pathname.startsWith(route));

  if (authToken) {
    // ----- User IS Authenticated -----
    if (isAuthFlowInitiationPage) {
      // If an authenticated user is on a page like /signin or /request-access,
      // redirect them to their main application page.
      // console.log(`Middleware: Authenticated user on auth initiation page ${pathname}. Redirecting to ${DEFAULT_AUTHENTICATED_REDIRECT}.`);
      return NextResponse.redirect(new URL(DEFAULT_AUTHENTICATED_REDIRECT, request.url));
    }
    // User is authenticated and not on an auth initiation page.
    // Allow access to all other pages (which includes your protected app pages,
    // and also utility pages like /unauthorized or /maintenance if they navigated there).
    return NextResponse.next();
  } else {
    // ----- User IS NOT Authenticated -----
    if (isPubliclyAccessible) {
      // Allow unauthenticated users to access pages like /signin, /request-access,
      // /unauthorized, /maintenance.
      return NextResponse.next();
    }

    // User is not authenticated and is trying to access any other page
    // (which, by your rule, is a protected page).
    // Redirect them to the sign-in page.
    // console.log(`Middleware: Unauthenticated user on protected route ${pathname}. Redirecting to ${SIGNIN_PATH}.`);
    const signInUrl = new URL(SIGNIN_PATH, request.url);
    signInUrl.searchParams.set('redirectUrl', pathname); // Remember where they were going
    return NextResponse.redirect(signInUrl);
  }
}

// Configure the matcher to define which paths the middleware runs on.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ (API routes are already excluded in the function by pathname.startsWith('/api'))
     * This broad matcher ensures page routes are covered.
     */
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};