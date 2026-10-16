/**
 * Seeds the mmasi database from the curated content in src/data, creates the
 * studio Setting and the admin user, and ensures the MinIO bucket exists.
 *
 *   npm run seed
 *
 * Idempotent: re-running upserts content and leaves an existing admin password
 * untouched. Media URLs start empty — the admin uploads real files later; the
 * public site renders graded Plate placeholders until then.
 */
import mongoose from "mongoose";
import { type PolicyDocument, RESOURCES } from "../src/constants/iam";
import { SOCIALS, STUDIO } from "../src/constants/studio";
import { CASE_STUDIES } from "../src/data/casestudies";
import { DEFAULT_CONTENT } from "../src/data/content";
import { FILMS, REELS } from "../src/data/films";
import { PHOTOS } from "../src/data/portfolio";
import { SERVICES } from "../src/data/services";
import { hashPassword } from "../src/server/auth";
import { connectDB } from "../src/server/db";
import {
	AdminUser,
	CaseStudy,
	Film,
	Group,
	Photo,
	Policy,
	Reel,
	Service,
	Setting,
	SiteContent,
} from "../src/server/models";
import { ensureStorageReady } from "../src/server/storage";

// System policies (managedBy:"system" — the API refuses to edit or delete them).
const fullAll = Object.fromEntries(RESOURCES.map((r) => [r, "full"])) as PolicyDocument;
const SYSTEM_POLICIES: Array<{ name: string; description: string; document: PolicyDocument }> = [
	{
		name: "Owner",
		description: "Full access to every admin section, including users and roles.",
		document: fullAll,
	},
	{
		name: "Editor",
		description: "Manage all content and media; read inquiries; no settings or IAM.",
		document: {
			portfolio: "full",
			reels: "full",
			films: "full",
			casestudies: "full",
			services: "full",
			content: "full",
			media: "full",
			inquiries: "read",
		},
	},
	{
		name: "Viewer",
		description: "Read-only across the admin, except user and role management.",
		document: Object.fromEntries(
			RESOURCES.filter((r) => r !== "iam").map((r) => [r, "read"]),
		) as PolicyDocument,
	},
];

async function main() {
	console.log("Preparing media storage…");
	try {
		await ensureStorageReady();
		console.log("  storage ready");
	} catch (e) {
		console.warn(`  storage step skipped: ${(e as Error).message}`);
	}

	console.log("Connecting to MongoDB…");
	await connectDB();

	console.log("Seeding photos…");
	for (const [i, p] of PHOTOS.entries()) {
		await Photo.updateOne({ slug: p.slug }, { $set: { ...p, order: i } }, { upsert: true });
	}
	console.log("Seeding reels…");
	for (const [i, r] of REELS.entries()) {
		await Reel.updateOne({ slug: r.slug }, { $set: { ...r, order: i } }, { upsert: true });
	}
	console.log("Seeding films…");
	for (const [i, f] of FILMS.entries()) {
		await Film.updateOne({ slug: f.slug }, { $set: { ...f, order: i } }, { upsert: true });
	}
	console.log("Seeding case studies…");
	for (const [i, c] of CASE_STUDIES.entries()) {
		await CaseStudy.updateOne({ slug: c.slug }, { $set: { ...c, order: i } }, { upsert: true });
	}

	console.log("Seeding services…");
	for (const [i, s] of SERVICES.entries()) {
		await Service.updateOne({ slug: s.slug }, { $set: { ...s, order: i } }, { upsert: true });
	}

	console.log("Seeding site content…");
	// Only seed copy when none exists, so a re-seed never clobbers admin edits.
	await SiteContent.updateOne(
		{ key: "site" },
		{ $setOnInsert: { data: DEFAULT_CONTENT } },
		{ upsert: true },
	);

	console.log("Seeding studio settings…");
	await Setting.updateOne(
		{ key: "studio" },
		{
			$set: {
				name: STUDIO.name,
				tagline: STUDIO.tagline,
				whatsappNumber: STUDIO.whatsappNumber,
				whatsappDigits: STUDIO.whatsappDigits,
				displayPhone: STUDIO.whatsappNumber,
				email: STUDIO.email,
				base: STUDIO.base,
				availability: STUDIO.availability,
				responseTime: STUDIO.responseTime,
				socials: SOCIALS,
				showResponseGuarantee: true,
			},
		},
		{ upsert: true },
	);

	console.log("Seeding admin user…");
	const email = (process.env.ADMIN_EMAIL || "").toLowerCase();
	const password = process.env.ADMIN_PASSWORD || "";
	let adminUser: { _id: unknown } | null = null;
	if (!email || !password) {
		console.warn("  ADMIN_EMAIL/ADMIN_PASSWORD not set — skipping admin user");
	} else {
		adminUser = await AdminUser.findOne({ email });
		if (adminUser) {
			console.log(`  admin ${email} already exists — password left unchanged`);
		} else {
			adminUser = await AdminUser.create({
				email,
				passwordHash: await hashPassword(password),
			});
			console.log(`  created admin ${email}`);
		}
	}

	// Backfill status on admins created before the field existed, so IAM reads a
	// concrete "active" instead of undefined.
	await AdminUser.updateMany({ status: { $exists: false } }, { $set: { status: "active" } });

	console.log("Seeding IAM policies…");
	for (const p of SYSTEM_POLICIES) {
		await Policy.updateOne(
			{ name: p.name },
			{ $set: { description: p.description, managedBy: "system", document: p.document } },
			{ upsert: true },
		);
	}

	console.log("Seeding Owners group…");
	// The Owners group holds the Owner policy and the seeded admin, so the
	// existing admin logs in as a full owner and nothing locks them out.
	const ownerPolicy = await Policy.findOne({ name: "Owner" });
	if (ownerPolicy) {
		await Group.updateOne(
			{ name: "Owners" },
			{
				$set: { managedBy: "system" },
				$setOnInsert: { description: "Studio owners with full access." },
				$addToSet: {
					policies: ownerPolicy._id,
					...(adminUser ? { members: adminUser._id } : {}),
				},
			},
			{ upsert: true },
		);
	}

	const counts = {
		photos: await Photo.countDocuments(),
		reels: await Reel.countDocuments(),
		films: await Film.countDocuments(),
		caseStudies: await CaseStudy.countDocuments(),
		services: await Service.countDocuments(),
		admins: await AdminUser.countDocuments(),
		policies: await Policy.countDocuments(),
		groups: await Group.countDocuments(),
	};
	console.log("Done:", counts);
	await mongoose.disconnect();
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
