import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth";
import { connectDB } from "@/server/db";
import { Passkey } from "@/server/models";

// The current admin's passkeys — only the fields the Settings UI needs, never
// the credential id or public key.
export async function GET() {
	let session: Awaited<ReturnType<typeof requireAdmin>>;
	try {
		session = await requireAdmin();
	} catch (r) {
		return r as Response;
	}
	await connectDB();
	const passkeys = await Passkey.find({ userId: session.sub }).sort({ createdAt: -1 }).lean();
	return NextResponse.json(
		passkeys.map((p) => ({
			id: String(p._id),
			deviceName: p.deviceName,
			createdAt: p.createdAt,
		})),
	);
}
