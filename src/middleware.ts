import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Don't redirect auth pages
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
      return NextResponse.next()
    }

    // Redirect to login if no token
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Role-based access control
    const userRole = token.role as string

    // Admin routes - only administrators can access
    if (pathname.startsWith("/admin")) {
      if (userRole !== "administrator") {
        return NextResponse.redirect(new URL("/user", req.url))
      }
    }

    // Publisher routes - only publishers and administrators can access
    if (pathname.startsWith("/publisher")) {
      if (userRole !== "publisher" && userRole !== "administrator") {
        return NextResponse.redirect(new URL("/user", req.url))
      }
    }

    // User routes - all authenticated users can access
    if (pathname.startsWith("/user")) {
      // Allow all authenticated users
      return NextResponse.next()
    }

    // Redirect to appropriate dashboard based on role
    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      if (userRole === "administrator") {
        return NextResponse.redirect(new URL("/admin", req.url))
      } else if (userRole === "publisher") {
        return NextResponse.redirect(new URL("/publisher", req.url))
      } else {
        return NextResponse.redirect(new URL("/user", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Require authentication for dashboard routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/publisher/:path*",
    "/user/:path*"
  ]
}
