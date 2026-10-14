import "server-only";
import { DEFAULT_CONTENT } from "@/data/content";
import type { SiteContentData } from "@/types";
import { connectDB } from "./db";
import { CaseStudy, Film, Photo, Reel, Service, Setting, SiteContent } from "./models";

// Plain, serializable objects for React Server Components: Mongo _id -> id, no
// __v, no Mongoose internals.
// biome-ignore lint/suspicious/noExplicitAny: lean() returns loosely-typed docs
function clean<T extends Record<string, any>>(doc: T) {
	const { _id, __v, createdAt, updatedAt, ...rest } = doc;
	return { id: String(_id), ...rest };
}

export async function getPhotos(opts: { publishedOnly?: boolean } = {}) {
	await connectDB();
	const q = opts.publishedOnly ? { status: "Published" } : {};
	const docs = await Photo.find(q).sort({ order: 1, createdAt: -1 }).lean();
	return docs.map(clean);
}

export async function getReels(opts: { publishedOnly?: boolean } = {}) {
	await connectDB();
	const q = opts.publishedOnly ? { status: "Published" } : {};
	const docs = await Reel.find(q).sort({ order: 1, createdAt: -1 }).lean();
	return docs.map(clean);
}

export async function getFilms(opts: { publishedOnly?: boolean } = {}) {
	await connectDB();
	const q = opts.publishedOnly ? { status: "Published" } : {};
	const docs = await Film.find(q).sort({ order: 1, createdAt: -1 }).lean();
	return docs.map(clean);
}

export async function getCaseStudies() {
	await connectDB();
	const docs = await CaseStudy.find().sort({ order: 1, createdAt: -1 }).lean();
	return docs.map(clean);
}

export async function getCaseStudy(slug: string) {
	await connectDB();
	const doc = await CaseStudy.findOne({ slug }).lean();
	return doc ? clean(doc) : null;
}

export async function getServices() {
	await connectDB();
	const docs = await Service.find().sort({ order: 1, createdAt: -1 }).lean();
	return docs.map(clean);
}

/** The editable page copy, falling back to DEFAULT_CONTENT when none is stored. */
export async function getSiteContent(): Promise<SiteContentData> {
	await connectDB();
	const doc = await SiteContent.findOne({ key: "site" }).lean();
	return (doc?.data as SiteContentData) ?? DEFAULT_CONTENT;
}

export async function getStudioSettings() {
	await connectDB();
	const doc = await Setting.findOne({ key: "studio" }).lean();
	return doc ? clean(doc) : null;
}

export type PublicService = Awaited<ReturnType<typeof getServices>>[number];
export type PublicPhoto = Awaited<ReturnType<typeof getPhotos>>[number];
export type PublicReel = Awaited<ReturnType<typeof getReels>>[number];
export type PublicFilm = Awaited<ReturnType<typeof getFilms>>[number];
export type PublicCaseStudy = NonNullable<Awaited<ReturnType<typeof getCaseStudy>>>;
export type PublicSettings = NonNullable<Awaited<ReturnType<typeof getStudioSettings>>>;
