import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
//middleware.tsx
export function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;

	const isPublicPath =
		path === "/login" || path === "/signup" || path === "/verifyemail";

	const token = request.cookies.get("token")?.value || "";

	//If already logged in, redirect to home
	//NOTE: change to /dashboard or /home when made
	if (isPublicPath && token) {
		return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
	}

	if (!isPublicPath && !token) {
		//if not logged in, redirect to login
		return NextResponse.redirect(new URL("/login", request.nextUrl));
	}
}

export const config = {
	//login & signup are public paths
	matcher: [
		"/",
		"/profile/:path*",
		"/profile",
		"/login",
		"/signup",
		"/verifyemail/:path*",
		"/dashboard",
		"/dashboard/:path*",
	],
};
