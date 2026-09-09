import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/work" || request.nextUrl.pathname === "/pt/work") {
    const url = request.nextUrl.clone();
    url.pathname = request.nextUrl.pathname.startsWith("/pt/") ? "/pt/case-studies" : "/case-studies";
    return NextResponse.redirect(url, 308);
  }

  if (request.nextUrl.pathname === "/index.html") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url, 308);
  }

  if (request.nextUrl.pathname === "/services/seo-google-visibility" || request.nextUrl.pathname === "/pt/services/seo-google-visibility") {
    const url = request.nextUrl.clone();
    url.pathname = request.nextUrl.pathname.startsWith("/pt/") ? "/pt/ai-search" : "/ai-search";
    return NextResponse.redirect(url, 308);
  }

  if (request.nextUrl.pathname === "/investimento") {
    const url = request.nextUrl.clone();
    url.pathname = "/pt/investimento";
    return NextResponse.redirect(url);
  }
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
