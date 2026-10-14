import { type NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/server/jwt";

// Gate every /admin page behind a valid session. /signin is not matched, so it
// stays public. Admin API mutations additionally check requireAdmin() in-handler.
export async function middleware(req: NextRequest) {
	const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
	if (!session) {
		const url = req.nextUrl.clone();
		url.pathname = "/signin";
		url.searchParams.set("next", req.nextUrl.pathname);
		return NextResponse.redirect(url);
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*"],
};
