import { NextResponse } from "next/server";
import { clean, permit } from "@/app/api/_lib/api";
import { connectDB } from "@/server/db";
import { Inquiry } from "@/server/models";

export async function GET() {
	const denied = await permit("inquiries", "read");
	if (denied) return denied;
	await connectDB();
	const docs = await Inquiry.find().sort({ createdAt: -1 }).lean();
	return NextResponse.json(docs.map((d) => clean(d)));
}
