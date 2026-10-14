import { NextResponse } from "next/server";
import { clean, guard } from "@/app/api/_lib/api";
import { connectDB } from "@/server/db";
import { Setting } from "@/server/models";

export async function GET() {
	const denied = await guard();
	if (denied) return denied;
	await connectDB();
	const doc = await Setting.findOne({ key: "studio" }).lean();
	return NextResponse.json(doc ? clean(doc) : {});
}

export async function PUT(req: Request) {
	const denied = await guard();
	if (denied) return denied;
	await connectDB();
	const body = await req.json();
	const doc = await Setting.findOneAndUpdate(
		{ key: "studio" },
		{ ...body, key: "studio" },
		{ returnDocument: "after", upsert: true, runValidators: true },
	).lean();
	if (!doc) return NextResponse.json({ error: "Save failed" }, { status: 500 });
	return NextResponse.json(clean(doc));
}
