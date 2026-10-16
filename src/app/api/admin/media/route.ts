import { NextResponse } from "next/server";
import { permit } from "@/app/api/_lib/api";
import { deleteAsset, renameAsset } from "@/server/media";
import { listObjects } from "@/server/storage";

// Lists uploaded objects straight from storage, so the picker never drifts
// from what is actually in the bucket (no separate media index to keep in sync).
export async function GET() {
	const denied = await permit("media", "read");
	if (denied) return denied;
	const items = await listObjects();
	return NextResponse.json(items);
}

export async function PATCH(req: Request) {
	const denied = await permit("media", "full");
	if (denied) return denied;
	const { key, name } = await req.json();
	if (typeof key !== "string" || typeof name !== "string") {
		return NextResponse.json({ error: "key and name are required" }, { status: 400 });
	}
	const result = await renameAsset(key, name);
	if (!result.ok) {
		const taken = result.error.includes("already exists");
		return NextResponse.json({ error: result.error }, { status: taken ? 409 : 400 });
	}
	return NextResponse.json({ key: result.key, url: result.url });
}

export async function DELETE(req: Request) {
	const denied = await permit("media", "full");
	if (denied) return denied;
	const { searchParams } = new URL(req.url);
	const key = searchParams.get("key");
	if (!key) return NextResponse.json({ error: "key is required" }, { status: 400 });
	const result = await deleteAsset(key, searchParams.get("force") === "1");
	if (!result.ok) return NextResponse.json({ references: result.references }, { status: 409 });
	return NextResponse.json({ ok: true });
}
