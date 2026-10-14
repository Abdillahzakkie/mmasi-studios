import { NextResponse } from "next/server";
import { guard } from "@/app/api/_lib/api";
import { uploadObject } from "@/server/storage";

// Receives the file itself (multipart) and stores it server-side, so the
// browser never PUTs to MinIO directly (no CORS setup on the shared bucket).
export async function POST(req: Request) {
	const denied = await guard();
	if (denied) return denied;
	const form = await req.formData();
	const file = form.get("file");
	if (!(file instanceof File)) {
		return NextResponse.json({ error: "A file is required" }, { status: 400 });
	}
	const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
	const key = `uploads/${Date.now()}-${safe}`;
	const bytes = new Uint8Array(await file.arrayBuffer());
	const result = await uploadObject(key, bytes, file.type || "application/octet-stream");
	return NextResponse.json(result);
}
