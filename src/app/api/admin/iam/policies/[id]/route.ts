import { NextResponse } from "next/server";
import { clean, permit } from "@/app/api/_lib/api";
import { isValidDocument } from "@/constants/iam";
import { connectDB } from "@/server/db";
import { Group, Policy } from "@/server/models";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Params) {
	const denied = await permit("iam", "full");
	if (denied) return denied;
	await connectDB();
	const { id } = await ctx.params;
	const policy = await Policy.findById(id);
	if (!policy) return NextResponse.json({ error: "Not found" }, { status: 404 });
	if (policy.managedBy === "system") {
		return NextResponse.json({ error: "System policies cannot be edited." }, { status: 403 });
	}
	const body = await req.json();
	if (body.document !== undefined && !isValidDocument(body.document)) {
		return NextResponse.json({ error: "invalid policy document" }, { status: 400 });
	}
	if (typeof body.name === "string" && body.name.trim()) {
		const clash = await Policy.findOne({ name: body.name.trim(), _id: { $ne: id } });
		if (clash) return NextResponse.json({ error: "Name taken." }, { status: 409 });
		policy.name = body.name.trim();
	}
	if (typeof body.description === "string") policy.description = body.description;
	if (body.document !== undefined) policy.document = body.document;
	await policy.save();
	return NextResponse.json(clean(policy.toObject()));
}

export async function DELETE(_req: Request, ctx: Params) {
	const denied = await permit("iam", "full");
	if (denied) return denied;
	await connectDB();
	const { id } = await ctx.params;
	const policy = await Policy.findById(id);
	if (!policy) return NextResponse.json({ error: "Not found" }, { status: 404 });
	if (policy.managedBy === "system") {
		return NextResponse.json({ error: "System policies cannot be deleted." }, { status: 403 });
	}
	await policy.deleteOne();
	// Drop the dangling reference from any group that held this policy.
	await Group.updateMany({ policies: id }, { $pull: { policies: id } });
	return NextResponse.json({ ok: true });
}
