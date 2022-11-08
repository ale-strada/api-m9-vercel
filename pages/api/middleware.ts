// pages/api/_middleware.ts
import { NextResponse } from "next/server";
// import type { NextRequest } from 'next/server'

// export function middleware(request: NextRequest) {
//   return NextResponse.rewrite(new URL('/about-2', request.url))
// }

import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  if (req.method == "OPTIONS") {
    return NextResponse.rewrite("", {
      status: 204,
      headers: {
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
        "Access-Control-Allow-Headers": req.headers.get(
          "Access-Control-Request-Headers"
        ),
        Vary: "Access-Control-Request-Headers",
        "Content-Length": "0",
      },
    });
  }
}
