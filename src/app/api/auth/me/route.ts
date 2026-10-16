import { NextResponse } from "next/server";
import { getSession } from "@/server/auth";
import { connectDB } from "@/server/db";
import { getEffectivePermissions } from "@/server/iam";
import { AdminUser, Group } from "@/server/models";

export async function GET() {
	const session = await getSession();
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	await connectDB();
	const [user, groups, permissions] = await Promise.all([
		AdminUser.findById(session.sub).select("name").lean(),
		Group.find({ members: session.sub }).select("name").lean(),
		getEffectivePermissions(session.sub),
	]);
	return NextResponse.json({
		email: session.email,
		name: user?.name ?? "",
		permissions,
		groups: groups.map((g) => g.name),
		isOwner: permissions.iam === "full",
	});
}
