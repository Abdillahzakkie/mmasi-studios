import { NextResponse } from "next/server";
import { guard } from "@/app/api/_lib/api";
import { uploadObject } from "@/server/storage";

// Overwrites the object at an existing key with a new file, keeping the key
// (and therefore every reference URL) unchanged.
export async function POST(req: Request) {
	const denied = await guard();
	if (denied) return denied;
	const form = await req.formData();
	const file = form.get("file");
	const key = form.get("key");
	if (!(file instanceof File) || typeof key !== "string" || !key) {
		return NextResponse.json({ error: "file and key are required" }, { status: 400 });
	}
	const bytes = new Uint8Array(await file.arrayBuffer());
	const result = await uploadObject(key, bytes, file.type || "application/octet-stream");
	return NextResponse.json(result);
}
