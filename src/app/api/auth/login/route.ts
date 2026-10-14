import { NextResponse } from "next/server";
import { startSession, verifyPassword } from "@/server/auth";
import { connectDB } from "@/server/db";
import { AdminUser } from "@/server/models";

export async function POST(req: Request) {
	await connectDB();
	const { email, password } = (await req.json()) as { email?: string; password?: string };
	if (!email || !password) {
		return NextResponse.json({ ok: false }, { status: 401 });
	}
	const user = await AdminUser.findOne({ email: email.toLowerCase() });
	if (!user || !(await verifyPassword(password, user.passwordHash))) {
		return NextResponse.json({ ok: false }, { status: 401 });
	}
	await startSession({ sub: String(user._id), email: user.email });
	return NextResponse.json({ ok: true });
}
