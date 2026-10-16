import { NextResponse } from "next/server";
import { clean, permit } from "@/app/api/_lib/api";
import { connectDB } from "@/server/db";
import { Group } from "@/server/models";

type PopPolicy = { _id: unknown; name: string };
type PopMember = { _id: unknown; name: string; email: string; status: string };
type PopGroup = {
	_id: unknown;
	name: string;
	description: string;
	managedBy: "system" | "custom";
	policies: PopPolicy[];
	members: PopMember[];
};

export async function GET() {
	const denied = await permit("iam", "read");
	if (denied) return denied;
	await connectDB();
	const docs = (await Group.find()
		.sort({ name: 1 })
		.populate("policies", "name")
		.populate("members", "name email status")
		.lean()) as unknown as PopGroup[];
	return NextResponse.json(
		docs.map((g) => ({
			id: String(g._id),
			name: g.name,
			description: g.description,
			managedBy: g.managedBy,
			policies: (g.policies ?? []).map((p) => ({ id: String(p._id), name: p.name })),
			members: (g.members ?? []).map((m) => ({
				id: String(m._id),
				name: m.name,
				email: m.email,
				status: m.status,
			})),
		})),
	);
}

export async function POST(req: Request) {
	const denied = await permit("iam", "full");
	if (denied) return denied;
	await connectDB();
	const { name, description, policyIds, memberIds } = await req.json();
	if (typeof name !== "string" || !name.trim()) {
		return NextResponse.json({ error: "name is required" }, { status: 400 });
	}
	if (await Group.findOne({ name: name.trim() })) {
		return NextResponse.json({ error: "Name taken." }, { status: 409 });
	}
	const doc = await Group.create({
		name: name.trim(),
		description: typeof description === "string" ? description : "",
		policies: Array.isArray(policyIds) ? policyIds : [],
		members: Array.isArray(memberIds) ? memberIds : [],
	});
	return NextResponse.json(clean(doc.toObject()), { status: 201 });
}
