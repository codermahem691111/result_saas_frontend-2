import { NextResponse } from "next/server";

// Frontend route protection: dashboards need a session cookie for the matching role.
// (The backend independently verifies the signed token on every API call.)
export function middleware(req) {
  const { pathname } = req.nextUrl;
  const section = pathname.split("/")[1]; // admin | teacher | student
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;
  if (!token || role !== section) {
    const url = req.nextUrl.clone();
    url.pathname = `/login/${section}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/teacher/:path*", "/student/:path*"] };
