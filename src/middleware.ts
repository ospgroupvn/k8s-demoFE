// export { default } from "next-auth/middleware";
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

const authMiddleware = withAuth(
  // Note that this callback is only invoked if
  // the `authorized` callback has returned `true`
  // and not for pages listed in `pages`.
  {
    callbacks: {
      authorized: ({ token }) => token != null,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export default function middleware(req: NextRequest) {
  if (req.url.includes("_next/data")) {
    return new NextResponse(null, { status: 404 });
  }

  // const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname)

  // const [, locale, pathname, isDetail, id] = req.nextUrl.pathname.split("/")

  // console.log('locale', locale)
  // console.log('aaaaaa', req.nextUrl.pathname)

  // if (req.nextUrl.pathname.includes("/request/reqPayment")) {
  //   if (locale === "en" && isDetail === undefined) {
  //     req.nextUrl.pathname = `${locale}/reqPayment`
  //   } else {
  //     req.nextUrl.pathname = `reqPayment`
  //   }
  //   if (locale === "en" && isDetail === "edit") {
  //     req.nextUrl.pathname = `${locale}/reqPayment/${isDetail}/${id}`
  //   } else if (isDetail === "edit") {
  //     req.nextUrl.pathname = `reqPayment/${isDetail}/${id}`
  //   }

  //   if (locale === "en" && isDetail === "add") {
  //     req.nextUrl.pathname = `${locale}/reqPayment/${isDetail}`
  //   } else if (isDetail === "add") {
  //     req.nextUrl.pathname = `reqPayment/${isDetail}`
  //   }
  // }

  // if (
  //   req.nextUrl.pathname.includes(`/transReport/san-luong-ctv`) &&
  //   !req.nextUrl.pathname.includes("_next") &&
  //   !req.nextUrl.pathname.includes(`/transReport/san-luong-ctv-theo-nvbh`)
  // ) {
  //   if (locale === "en") {
  //     req.nextUrl.pathname = `${locale}/transReport/san-luong-ctv-mbf2`
  //   } else {
  //     req.nextUrl.pathname = `transReport/san-luong-ctv-mbf2`
  //   }
  // }

  // if (
  //   req.nextUrl.pathname.includes(`/transReport/san-luong-ctv-theo-ngay`) &&
  //   !req.nextUrl.pathname.includes("_next")
  // ) {
  //   if (locale === "en") {
  //     req.nextUrl.pathname = `${locale}/transReport/san-luong-theo-ngay-ctv`
  //   } else {
  //     req.nextUrl.pathname = `transReport/san-luong-theo-ngay-ctv`
  //   }
  // }

  // if (
  //   req.nextUrl.pathname.includes("/transReport/san-luong-nvbh") &&
  //   !req.nextUrl.pathname.includes("_next")
  // ) {
  //   if (locale === "en") {
  //     req.nextUrl.pathname = `${locale}/transReport/san-luong-nvbh-mbf2`
  //   } else {
  //     req.nextUrl.pathname = `/transReport/san-luong-nvbh-mbf2`
  //   }
  // }

  // if (isPublicPage) {
  // return intlMiddleware(req)
  // } else {

  return (authMiddleware as any)(req);
  // }
}

export const config = {
  matcher: ["/profile"],
  // matcher: [
  //   "/((?!register|api|login).*)",
  //   "/",
  //   "/login",
  //   "/(vi|en)/:path*",
  //   "/favicon.ico",
  // ],
};
