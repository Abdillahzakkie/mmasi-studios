import { NextResponse } from "next/server";
import { clean, permit } from "@/app/api/_lib/api";
import { connectDB } from "@/server/db";
import { Inquiry } from "@/server/models";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Params) {
	const denied = await permit("inquiries", "read");
	if (denied) return denied;
	await connectDB();
	const { id } = await ctx.params;
	const doc = await Inquiry.findById(id).lean();
	if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
	return NextResponse.json(clean(doc));
}

export async function PATCH(req: Request, ctx: Params) {
	const denied = await permit("inquiries", "full");
	if (denied) return denied;
	await connectDB();
	const { id } = await ctx.params;
	const { status } = (await req.json()) as { status?: string };
	const doc = await Inquiry.findByIdAndUpdate(
		id,
		{ status },
		{ returnDocument: "after", runValidators: true },
	).lean();
	if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
	return NextResponse.json(clean(doc));
}
