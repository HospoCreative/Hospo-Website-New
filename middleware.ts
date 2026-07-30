import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isPortuguese = request.nextUrl.pathname === "/pt" || request.nextUrl.pathname.startsWith("/pt/");
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-hospo-locale", isPortuguese ? "pt" : "en");
  requestHeaders.set("x-hospo-path", request.nextUrl.pathname);

  if (!isPortuguese) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const url = request.nextUrl.clone();
  url.pathname = request.nextUrl.pathname.slice(3) || "/";
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!api|admin|_next/static|_next/image|favicon.ico|images|videos).*)"]
};
