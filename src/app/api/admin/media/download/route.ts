import { NextResponse } from "next/server";
import { permit } from "@/app/api/_lib/api";
import { getObjectStream } from "@/server/storage";

// Same-origin download: streams the object with Content-Disposition so the
// browser saves it under its filename (the public bucket URL is a different
// origin, where the <a download> hint is ignored).
export async function GET(req: Request) {
	const denied = await permit("media", "read");
	if (denied) return denied;
	const key = new URL(req.url).searchParams.get("key");
	if (!key) return NextResponse.json({ error: "key is required" }, { status: 400 });
	const obj = await getObjectStream(key);
	if (!obj) return NextResponse.json({ error: "Not found" }, { status: 404 });
	const name = key.replace(/^uploads\//, "").replace(/["\\]/g, "");
	return new NextResponse(obj.body, {
		headers: {
			"Content-Type": obj.contentType,
			"Content-Disposition": `attachment; filename="${name}"`,
		},
	});
}
