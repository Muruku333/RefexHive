import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const protectedRoutes = ['/', '/contact'];
  const authRoutes = ['/login'];

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname === route);

  // Check if the current route is an auth route
  const isAuthRoute = authRoutes.includes(pathname);

  // Get token from cookies - must be awaited
  const token = request.cookies.get('accessToken')?.value;

  if (isProtectedRoute && !token) {
    // Redirect to login if trying to access protected route without token
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
    // Redirect to home if trying to access auth route with token
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
