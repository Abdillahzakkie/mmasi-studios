import { NextResponse } from "next/server";
import { permit } from "@/app/api/_lib/api";
import { findReferences } from "@/server/media";

export async function GET(req: Request) {
	const denied = await permit("media", "read");
	if (denied) return denied;
	const key = new URL(req.url).searchParams.get("key");
	if (!key) return NextResponse.json({ error: "key is required" }, { status: 400 });
	const references = await findReferences(key);
	return NextResponse.json({ references });
}
