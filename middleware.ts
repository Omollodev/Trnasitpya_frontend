import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Only apply middleware to admin routes
  if (pathname.startsWith('/admin')) {
    // Get token from cookie
    const token = request.cookies.get('accessToken')?.value
    
    if (!token) {
      // No token found, redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    try {
      // Verify token and check if user is admin
      // Note: In a real app, you'd use the correct secret key from env vars
      const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')
      const { payload } = await jwtVerify(token, secretKey)
      
      // Check if user has admin role
      const isAdmin = payload.isAdmin === true || payload.role === 'admin'
      
      if (!isAdmin) {
        // User is not an admin, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      
      // Admin user, allow access
      return NextResponse.next()
    } catch (error) {
      // Invalid token, redirect to login
      console.error('Admin middleware error:', error)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  // For all other routes, continue
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*'],
} 