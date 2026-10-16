import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth";
import { connectDB } from "@/server/db";
import { Passkey } from "@/server/models";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, ctx: Params) {
	let session: Awaited<ReturnType<typeof requireAdmin>>;
	try {
		session = await requireAdmin();
	} catch (r) {
		return r as Response;
	}
	await connectDB();
	const { id } = await ctx.params;
	// Scoped to the owner's own passkeys, so one admin can't delete another's.
	await Passkey.deleteOne({ _id: id, userId: session.sub });
	return NextResponse.json({ ok: true });
}
