import "server-only";
import { connectDB } from "./db";
import { CaseStudy, Film, Photo, Reel, SiteContent } from "./models";
import { copyObject, deleteObject, objectExists, publicUrl } from "./storage";

export interface MediaRef {
	type: "Photo" | "Reel" | "Film" | "CaseStudy" | "Content";
	id: string;
	title: string;
	field: "image" | "video" | "poster" | "cover" | "frame";
}

/** Every record that points at the object stored under `key` (by key or URL). */
export async function findReferences(key: string): Promise<MediaRef[]> {
	await connectDB();
	const url = publicUrl(key);
	const refs: MediaRef[] = [];

	for (const p of await Photo.find({ $or: [{ imageKey: key }, { imageUrl: url }] }).lean()) {
		refs.push({
			type: "Photo",
			id: String(p._id),
			title: p.title ?? "(untitled)",
			field: "image",
		});
	}

	for (const [Model, type] of [
		[Reel, "Reel"],
		[Film, "Film"],
	] as const) {
		const docs = await Model.find({
			$or: [{ videoKey: key }, { videoUrl: url }, { posterKey: key }, { posterUrl: url }],
		}).lean();
		for (const d of docs) {
			const isVideo = d.videoKey === key || d.videoUrl === url;
			refs.push({
				type,
				id: String(d._id),
				title: d.title ?? "(untitled)",
				field: isVideo ? "video" : "poster",
			});
		}
	}

	for (const c of await CaseStudy.find({
		$or: [{ coverUrl: url }, { "frames.imageUrl": url }],
	}).lean()) {
		refs.push({
			type: "CaseStudy",
			id: String(c._id),
			title: c.title ?? "(untitled)",
			field: c.coverUrl === url ? "cover" : "frame",
		});
	}

	// Page copy stores image URLs inside one Mixed blob; a substring hit means
	// one of its image slots (hero/showreel/portrait) points at this asset.
	const site = await SiteContent.findOne({ key: "site" }).lean();
	if (site?.data && JSON.stringify(site.data).includes(url)) {
		refs.push({ type: "Content", id: "site", title: "Site content", field: "image" });
	}

	return refs;
}

const sanitize = (s: string) =>
	s
		.replace(/^.*[/\\]/, "") // drop any path segments
		.replace(/[^a-zA-Z0-9._-]/g, "_")
		.replace(/^[._]+/, "");

export type RenameResult = { ok: true; key: string; url: string } | { ok: false; error: string };

/**
 * Renames the stored object to `name` (keeping its extension and the `uploads/`
 * prefix), rewrites every DB record that referenced the old key/URL, then
 * removes the old object. References stay intact.
 */
export async function renameAsset(key: string, name: string): Promise<RenameResult> {
	await connectDB();
	const dot = key.lastIndexOf(".");
	const ext = dot >= 0 ? key.slice(dot) : "";
	let safe = sanitize(name);
	if (!safe) return { ok: false, error: "A valid name is required." };
	if (ext && !safe.toLowerCase().endsWith(ext.toLowerCase())) safe += ext;
	const newKey = `uploads/${safe}`;
	if (newKey === key) return { ok: true, key, url: publicUrl(key) };
	if (await objectExists(newKey))
		return { ok: false, error: "A file with that name already exists." };

	const oldUrl = publicUrl(key);
	const newUrl = publicUrl(newKey);
	await copyObject(key, newKey);

	await Photo.updateMany({ imageKey: key }, { $set: { imageKey: newKey } });
	await Photo.updateMany({ imageUrl: oldUrl }, { $set: { imageUrl: newUrl } });
	for (const Model of [Reel, Film]) {
		await Model.updateMany({ videoKey: key }, { $set: { videoKey: newKey } });
		await Model.updateMany({ videoUrl: oldUrl }, { $set: { videoUrl: newUrl } });
		await Model.updateMany({ posterKey: key }, { $set: { posterKey: newKey } });
		await Model.updateMany({ posterUrl: oldUrl }, { $set: { posterUrl: newUrl } });
	}
	await CaseStudy.updateMany({ coverUrl: oldUrl }, { $set: { coverUrl: newUrl } });
	await CaseStudy.updateMany(
		{ "frames.imageUrl": oldUrl },
		{ $set: { "frames.$[f].imageUrl": newUrl } },
		{ arrayFilters: [{ "f.imageUrl": oldUrl }] },
	);

	// Rewrite any page-copy image slot that used the old URL (generic over the blob).
	const site = await SiteContent.findOne({ key: "site" });
	if (site?.data) {
		const json = JSON.stringify(site.data);
		if (json.includes(oldUrl)) {
			site.data = JSON.parse(json.replaceAll(oldUrl, newUrl));
			site.markModified("data");
			await site.save();
		}
	}

	await deleteObject(key);
	return { ok: true, key: newKey, url: newUrl };
}

export type DeleteResult = { ok: true } | { ok: false; references: MediaRef[] };

/** Deletes the object unless it is still referenced (pass `force` to override). */
export async function deleteAsset(key: string, force: boolean): Promise<DeleteResult> {
	const references = await findReferences(key);
	if (references.length > 0 && !force) return { ok: false, references };
	await deleteObject(key);
	return { ok: true };
}
