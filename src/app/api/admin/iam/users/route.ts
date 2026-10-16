import { NextResponse } from "next/server";
import { permit } from "@/app/api/_lib/api";
import { hashPassword } from "@/server/auth";
import { connectDB } from "@/server/db";
import { publicUser } from "@/server/iam";
import { AdminUser, Group } from "@/server/models";

export async function GET() {
	const denied = await permit("iam", "read");
	if (denied) return denied;
	await connectDB();
	const users = await AdminUser.find().sort({ createdAt: 1 }).lean();
	const groups = await Group.find().select("name members").lean();
	return NextResponse.json(
		users.map((u) => {
			const id = String(u._id);
			const userGroups = groups.filter((g) =>
				(g.members ?? []).some((m: unknown) => String(m) === id),
			);
			return {
				...publicUser(u),
				groups: userGroups.map((g) => ({ id: String(g._id), name: g.name })),
			};
		}),
	);
}

export async function POST(req: Request) {
	const denied = await permit("iam", "full");
	if (denied) return denied;
	await connectDB();
	const { email, password, name, status, groupIds } = await req.json();
	if (typeof email !== "string" || !email.trim() || typeof password !== "string" || !password) {
		return NextResponse.json({ error: "email and password are required" }, { status: 400 });
	}
	const normalized = email.toLowerCase().trim();
	if (await AdminUser.findOne({ email: normalized })) {
		return NextResponse.json({ error: "Email taken." }, { status: 409 });
	}
	const user = await AdminUser.create({
		email: normalized,
		passwordHash: await hashPassword(password),
		name: typeof name === "string" && name.trim() ? name.trim() : undefined,
		status: status === "disabled" ? "disabled" : "active",
	});
	if (Array.isArray(groupIds) && groupIds.length) {
		await Group.updateMany({ _id: { $in: groupIds } }, { $addToSet: { members: user._id } });
	}
	return NextResponse.json(publicUser(user.toObject()), { status: 201 });
}
