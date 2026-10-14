import "server-only";
import type { Model } from "mongoose";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth";
import { connectDB } from "@/server/db";
import { deleteObject } from "@/server/storage";

/** Returns a 401 Response when there's no admin session, else null. */
export async function guard(): Promise<Response | null> {
	try {
		await requireAdmin();
		return null;
	} catch (r) {
		return r as Response;
	}
}

/** Maps a Mongo document to a plain API object: `_id` → `id`, drops `__v`. */
export function clean<T extends { _id: unknown }>(doc: T): Omit<T, "_id" | "__v"> & { id: string } {
	const { _id, __v, ...rest } = doc as T & { __v?: unknown };
	return { ...(rest as Omit<T, "_id" | "__v">), id: String(_id) };
}

type Params = { params: Promise<{ id: string }> };

/** GET (all, sorted) + POST (create) handlers for a collection model. */
export function collection<T>(
	model: Model<T>,
	sort: Record<string, 1 | -1> = { order: 1, createdAt: -1 },
) {
	return {
		async GET() {
			const denied = await guard();
			if (denied) return denied;
			await connectDB();
			const docs = await model.find().sort(sort).lean();
			return NextResponse.json(docs.map((d) => clean(d)));
		},
		async POST(req: Request) {
			const denied = await guard();
			if (denied) return denied;
			await connectDB();
			const body = await req.json();
			const doc = new model(body);
			await doc.save();
			return NextResponse.json(clean(doc.toObject()), { status: 201 });
		},
	};
}

/** PUT (update) + DELETE handlers for one item; deletes any S3 keys on remove. */
export function resource<T>(model: Model<T>, keyFields: string[] = []) {
	return {
		async PUT(req: Request, ctx: Params) {
			const denied = await guard();
			if (denied) return denied;
			await connectDB();
			const { id } = await ctx.params;
			const body = await req.json();
			const doc = await model
				.findByIdAndUpdate(id, body, { returnDocument: "after", runValidators: true })
				.lean();
			if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
			return NextResponse.json(clean(doc));
		},
		async DELETE(_req: Request, ctx: Params) {
			const denied = await guard();
			if (denied) return denied;
			await connectDB();
			const { id } = await ctx.params;
			const doc = await model.findByIdAndDelete(id).lean();
			if (doc) {
				for (const field of keyFields) {
					const key = (doc as Record<string, unknown>)[field];
					if (typeof key === "string" && key) await deleteObject(key);
				}
			}
			return NextResponse.json({ ok: true });
		},
	};
}
