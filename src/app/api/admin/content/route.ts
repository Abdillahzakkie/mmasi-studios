import { NextResponse } from "next/server";
import { permit } from "@/app/api/_lib/api";
import { DEFAULT_CONTENT } from "@/data/content";
import { connectDB } from "@/server/db";
import { SiteContent } from "@/server/models";

export async function GET() {
	const denied = await permit("content", "read");
	if (denied) return denied;
	await connectDB();
	const doc = await SiteContent.findOne({ key: "site" }).lean();
	return NextResponse.json(doc?.data ?? DEFAULT_CONTENT);
}

export async function PUT(req: Request) {
	const denied = await permit("content", "full");
	if (denied) return denied;
	await connectDB();
	const data = await req.json();
	await SiteContent.updateOne({ key: "site" }, { $set: { data } }, { upsert: true });
	return NextResponse.json(data);
}
