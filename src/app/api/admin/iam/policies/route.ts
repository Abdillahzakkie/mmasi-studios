import { NextResponse } from "next/server";
import { clean, permit } from "@/app/api/_lib/api";
import { isValidDocument } from "@/constants/iam";
import { connectDB } from "@/server/db";
import { Policy } from "@/server/models";

export async function GET() {
	const denied = await permit("iam", "read");
	if (denied) return denied;
	await connectDB();
	const docs = await Policy.find().sort({ managedBy: 1, name: 1 }).lean();
	return NextResponse.json(docs.map((d) => clean(d)));
}

export async function POST(req: Request) {
	const denied = await permit("iam", "full");
	if (denied) return denied;
	await connectDB();
	const { name, description, document } = await req.json();
	if (typeof name !== "string" || !name.trim()) {
		return NextResponse.json({ error: "name is required" }, { status: 400 });
	}
	if (!isValidDocument(document)) {
		return NextResponse.json({ error: "invalid policy document" }, { status: 400 });
	}
	if (await Policy.findOne({ name: name.trim() })) {
		return NextResponse.json({ error: "Name taken." }, { status: 409 });
	}
	const doc = await Policy.create({
		name: name.trim(),
		description: typeof description === "string" ? description : "",
		managedBy: "custom",
		document,
	});
	return NextResponse.json(clean(doc.toObject()), { status: 201 });
}
