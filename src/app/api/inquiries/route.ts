import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db";
import { Inquiry } from "@/server/models";

// Public: the contact page builder submits an inquiry here (and still opens
// WhatsApp). No auth — anyone can send one. The admin reads these via
// /api/admin/inquiries.
export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => null);
	if (!body || typeof body.name !== "string" || !body.name.trim()) {
		return NextResponse.json({ ok: false, error: "A name is required." }, { status: 400 });
	}
	await connectDB();
	const doc = await Inquiry.create({
		name: String(body.name).slice(0, 200),
		phone: String(body.phone || "").slice(0, 60),
		service: String(body.service || "").slice(0, 200),
		date: String(body.date || "").slice(0, 120),
		location: String(body.location || "").slice(0, 200),
		vision: String(body.vision || "").slice(0, 4000),
		status: "New",
		source: "Contact page builder",
	});
	return NextResponse.json({ ok: true, id: String(doc._id) }, { status: 201 });
}
