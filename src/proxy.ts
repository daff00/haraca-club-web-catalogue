import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log("PATH:", req.nextUrl.pathname);
  console.log("TOKEN:", token);

  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};