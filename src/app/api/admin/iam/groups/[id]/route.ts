import { NextResponse } from "next/server";
import { clean, permit } from "@/app/api/_lib/api";
import { connectDB } from "@/server/db";
import { activeOwnerIds, activeOwnersAfterGroupChange } from "@/server/iam";
import { Group } from "@/server/models";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Params) {
	const denied = await permit("iam", "full");
	if (denied) return denied;
	await connectDB();
	const { id } = await ctx.params;
	const group = await Group.findById(id);
	if (!group) return NextResponse.json({ error: "Not found" }, { status: 404 });
	const body = await req.json();

	const currentPolicyIds = (group.policies ?? []).map(String);
	const currentMemberIds = (group.members ?? []).map(String);
	const nextPolicyIds = Array.isArray(body.policyIds)
		? body.policyIds.map(String)
		: currentPolicyIds;
	const nextMemberIds = Array.isArray(body.memberIds)
		? body.memberIds.map(String)
		: currentMemberIds;

	// A system group's policies are fixed, so the Owner policy stays linked; only
	// its members may change.
	if (
		group.managedBy === "system" &&
		currentPolicyIds.some((p: string) => !nextPolicyIds.includes(p))
	) {
		return NextResponse.json(
			{ error: "A system group's policies cannot be changed." },
			{ status: 403 },
		);
	}

	// No edit may leave the studio with zero owners.
	const before = await activeOwnerIds();
	if (before.length > 0) {
		const after = await activeOwnersAfterGroupChange(id, {
			policyIds: nextPolicyIds,
			memberIds: nextMemberIds,
		});
		if (after.length === 0) {
			return NextResponse.json(
				{ error: "This change would remove the last owner." },
				{ status: 409 },
			);
		}
	}

	if (typeof body.name === "string" && body.name.trim()) {
		const clash = await Group.findOne({ name: body.name.trim(), _id: { $ne: id } });
		if (clash) return NextResponse.json({ error: "Name taken." }, { status: 409 });
		group.name = body.name.trim();
	}
	if (typeof body.description === "string") group.description = body.description;
	if (Array.isArray(body.policyIds)) group.policies = body.policyIds;
	if (Array.isArray(body.memberIds)) group.members = body.memberIds;
	await group.save();
	return NextResponse.json(clean(group.toObject()));
}

export async function DELETE(_req: Request, ctx: Params) {
	const denied = await permit("iam", "full");
	if (denied) return denied;
	await connectDB();
	const { id } = await ctx.params;
	const group = await Group.findById(id);
	if (!group) return NextResponse.json({ error: "Not found" }, { status: 404 });
	if (group.managedBy === "system") {
		return NextResponse.json({ error: "System groups cannot be deleted." }, { status: 403 });
	}
	const before = await activeOwnerIds();
	if (before.length > 0 && (await activeOwnersAfterGroupChange(id, null)).length === 0) {
		return NextResponse.json(
			{ error: "Deleting this group would remove the last owner." },
			{ status: 409 },
		);
	}
	await group.deleteOne();
	return NextResponse.json({ ok: true });
}
