import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (path === "/studio-admin/login") return true;
        if (path.startsWith("/studio-admin")) return !!token;
        return true;
      },
    },
    pages: {
      signIn: "/studio-admin/login",
    },
  }
);

export const config = {
  matcher: ["/studio-admin", "/studio-admin/:path*"],
};
