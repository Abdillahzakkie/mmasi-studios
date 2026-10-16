import { NextResponse } from "next/server";
import { hashPassword } from "@/server/auth";
import { connectDB } from "@/server/db";
import {
	activeOwnerIds,
	getEffectivePermissions,
	permissionsForGroupIds,
	publicUser,
	requirePermission,
} from "@/server/iam";
import { AdminUser, Group } from "@/server/models";

type Params = { params: Promise<{ id: string }> };

/** Gates on iam:full and returns the acting admin's id, or the denial Response. */
async function gate(): Promise<{ selfId: string } | Response> {
	try {
		const { session } = await requirePermission("iam", "full");
		return { selfId: session.sub };
	} catch (r) {
		return r as Response;
	}
}

export async function PATCH(req: Request, ctx: Params) {
	const g = await gate();
	if (g instanceof Response) return g;
	await connectDB();
	const { id } = await ctx.params;
	const target = await AdminUser.findById(id);
	if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });
	const body = await req.json();

	// Work out the post-change state so we never strip the last owner or lock
	// the acting admin out of IAM.
	const proposedStatus =
		body.status === "disabled" || body.status === "active" ? body.status : target.status;
	const proposedGroupIds = Array.isArray(body.groupIds)
		? body.groupIds.map(String)
		: (await Group.find({ members: id }).select("_id").lean()).map((gr) => String(gr._id));
	const willBeOwner =
		proposedStatus !== "disabled" &&
		(await permissionsForGroupIds(proposedGroupIds)).iam === "full";

	const current = await getEffectivePermissions(id);
	const isOwnerNow = target.status !== "disabled" && current.iam === "full";
	if (isOwnerNow && !willBeOwner && (await activeOwnerIds()).length <= 1) {
		return NextResponse.json(
			{ error: "Cannot remove the last owner's access." },
			{ status: 409 },
		);
	}
	if (id === g.selfId && !willBeOwner) {
		return NextResponse.json(
			{ error: "You cannot remove your own owner access." },
			{ status: 409 },
		);
	}

	if (typeof body.email === "string" && body.email.trim()) {
		const normalized = body.email.toLowerCase().trim();
		if (await AdminUser.findOne({ email: normalized, _id: { $ne: id } })) {
			return NextResponse.json({ error: "Email taken." }, { status: 409 });
		}
		target.email = normalized;
	}
	if (typeof body.name === "string") target.name = body.name;
	if (body.status === "active" || body.status === "disabled") target.status = body.status;
	if (typeof body.password === "string" && body.password) {
		target.passwordHash = await hashPassword(body.password);
	}
	await target.save();

	if (Array.isArray(body.groupIds)) {
		await Group.updateMany(
			{ _id: { $nin: proposedGroupIds }, members: id },
			{ $pull: { members: id } },
		);
		await Group.updateMany({ _id: { $in: proposedGroupIds } }, { $addToSet: { members: id } });
	}
	return NextResponse.json(publicUser(target.toObject()));
}

export async function DELETE(_req: Request, ctx: Params) {
	const g = await gate();
	if (g instanceof Response) return g;
	await connectDB();
	const { id } = await ctx.params;
	if (id === g.selfId) {
		return NextResponse.json({ error: "You cannot delete your own account." }, { status: 409 });
	}
	const target = await AdminUser.findById(id);
	if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });
	const current = await getEffectivePermissions(id);
	if (
		target.status !== "disabled" &&
		current.iam === "full" &&
		(await activeOwnerIds()).length <= 1
	) {
		return NextResponse.json({ error: "Cannot delete the last owner." }, { status: 409 });
	}
	await target.deleteOne();
	await Group.updateMany({ members: id }, { $pull: { members: id } });
	return NextResponse.json({ ok: true });
}
