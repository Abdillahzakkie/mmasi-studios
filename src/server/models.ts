import "server-only";
import mongoose, { type InferSchemaType, Schema } from "mongoose";

const TONES = ["warm", "cool", "portrait"] as const;
const PUB_STATUS = ["Published", "Draft"] as const;

const photoSchema = new Schema(
	{
		slug: { type: String, required: true, unique: true },
		title: { type: String, required: true },
		category: { type: String, required: true },
		location: { type: String, default: "" },
		year: { type: Number, default: new Date().getFullYear() },
		camera: { type: String, default: "" },
		lens: { type: String, default: "" },
		caption: { type: String, default: "" },
		tone: { type: String, enum: TONES, default: "warm" },
		ratio: { type: String, default: "4/5" },
		featured: { type: Boolean, default: false },
		status: { type: String, enum: PUB_STATUS, default: "Draft" },
		imageKey: { type: String, default: "" },
		imageUrl: { type: String, default: "" },
		order: { type: Number, default: 0 },
	},
	{ timestamps: true },
);

const reelSchema = new Schema(
	{
		slug: { type: String, required: true, unique: true },
		title: { type: String, required: true },
		category: { type: String, default: "" },
		duration: { type: String, default: "" },
		tone: { type: String, enum: TONES, default: "warm" },
		videoKey: { type: String, default: "" },
		videoUrl: { type: String, default: "" },
		posterKey: { type: String, default: "" },
		posterUrl: { type: String, default: "" },
		status: { type: String, enum: PUB_STATUS, default: "Draft" },
		order: { type: Number, default: 0 },
	},
	{ timestamps: true },
);

const filmSchema = new Schema(
	{
		slug: { type: String, required: true, unique: true },
		title: { type: String, required: true },
		category: { type: String, default: "" },
		synopsis: { type: String, default: "" },
		duration: { type: String, default: "" },
		resolution: { type: String, default: "" },
		year: { type: Number, default: new Date().getFullYear() },
		location: { type: String, default: "" },
		tone: { type: String, enum: TONES, default: "cool" },
		videoKey: { type: String, default: "" },
		videoUrl: { type: String, default: "" },
		posterKey: { type: String, default: "" },
		posterUrl: { type: String, default: "" },
		status: { type: String, enum: PUB_STATUS, default: "Draft" },
		order: { type: Number, default: 0 },
	},
	{ timestamps: true },
);

const caseStudySchema = new Schema(
	{
		slug: { type: String, required: true, unique: true },
		title: { type: String, required: true },
		category: { type: String, default: "" },
		client: { type: String, default: "" },
		location: { type: String, default: "" },
		year: { type: Number, default: new Date().getFullYear() },
		role: { type: String, default: "" },
		tone: { type: String, enum: TONES, default: "portrait" },
		vision: { type: String, default: "" },
		production: { type: String, default: "" },
		coverUrl: { type: String, default: "" },
		frames: [{ tone: { type: String, enum: TONES }, ratio: String, imageUrl: String }],
		order: { type: Number, default: 0 },
	},
	{ timestamps: true },
);

const serviceSchema = new Schema(
	{
		slug: { type: String, required: true, unique: true },
		tag: { type: String, default: "" },
		title: { type: String, required: true },
		description: { type: String, default: "" },
		investment: { type: String, default: "" },
		investmentNote: { type: String, default: "" },
		deliverables: { type: [String], default: [] },
		feature: { type: Boolean, default: false },
		order: { type: Number, default: 0 },
	},
	{ timestamps: true },
);

// One keyed document holding all editable page copy as a free-form blob; its
// shape is the SiteContentData contract in @/types. Mixed keeps the schema
// flat while the editor and wrappers own the structure.
const siteContentSchema = new Schema(
	{
		key: { type: String, required: true, unique: true, default: "site" },
		data: { type: Schema.Types.Mixed, default: {} },
	},
	{ timestamps: true, minimize: false },
);

const inquirySchema = new Schema(
	{
		name: { type: String, required: true },
		phone: { type: String, default: "" },
		service: { type: String, default: "" },
		date: { type: String, default: "" },
		location: { type: String, default: "" },
		vision: { type: String, default: "" },
		status: {
			type: String,
			enum: ["New", "Under review", "Booked", "Completed"],
			default: "New",
		},
		source: { type: String, default: "Contact page builder" },
	},
	{ timestamps: true },
);

const settingSchema = new Schema(
	{
		key: { type: String, required: true, unique: true, default: "studio" },
		name: String,
		tagline: String,
		whatsappNumber: String,
		whatsappDigits: String,
		displayPhone: String,
		email: String,
		base: String,
		availability: String,
		responseTime: String,
		socials: [{ label: String, href: String }],
		showResponseGuarantee: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

const adminUserSchema = new Schema(
	{
		email: { type: String, required: true, unique: true, lowercase: true },
		passwordHash: { type: String, required: true },
		name: { type: String, default: "Studio admin" },
		status: { type: String, enum: ["active", "disabled"], default: "active" },
	},
	{ timestamps: true },
);

// A reusable grant map (resource → "read" | "full"); the PolicyDocument contract
// in @/constants/iam. `managedBy: "system"` marks the seeded policies the API
// refuses to edit or delete.
const policySchema = new Schema(
	{
		name: { type: String, required: true, unique: true },
		description: { type: String, default: "" },
		managedBy: { type: String, enum: ["system", "custom"], default: "custom" },
		document: { type: Schema.Types.Mixed, default: {} },
	},
	{ timestamps: true, minimize: false },
);

// Groups bind policies to admin users. A user's effective permissions are the
// merge of every policy across every group they belong to.
const groupSchema = new Schema(
	{
		name: { type: String, required: true, unique: true },
		description: { type: String, default: "" },
		managedBy: { type: String, enum: ["system", "custom"], default: "custom" },
		policies: [{ type: Schema.Types.ObjectId, ref: "Policy" }],
		members: [{ type: Schema.Types.ObjectId, ref: "AdminUser" }],
	},
	{ timestamps: true },
);

export type PhotoDoc = InferSchemaType<typeof photoSchema>;
export type ReelDoc = InferSchemaType<typeof reelSchema>;
export type FilmDoc = InferSchemaType<typeof filmSchema>;
export type CaseStudyDoc = InferSchemaType<typeof caseStudySchema>;
export type ServiceDoc = InferSchemaType<typeof serviceSchema>;
export type SiteContentDoc = InferSchemaType<typeof siteContentSchema>;
export type InquiryDoc = InferSchemaType<typeof inquirySchema>;
export type SettingDoc = InferSchemaType<typeof settingSchema>;
export type AdminUserDoc = InferSchemaType<typeof adminUserSchema>;
export type PolicyDoc = InferSchemaType<typeof policySchema>;
export type GroupDoc = InferSchemaType<typeof groupSchema>;

// `mongoose.models.X ?? model(...)` avoids "Cannot overwrite model" on HMR.
export const Photo = mongoose.models.Photo ?? mongoose.model("Photo", photoSchema);
export const Reel = mongoose.models.Reel ?? mongoose.model("Reel", reelSchema);
export const Film = mongoose.models.Film ?? mongoose.model("Film", filmSchema);
export const CaseStudy = mongoose.models.CaseStudy ?? mongoose.model("CaseStudy", caseStudySchema);
export const Service = mongoose.models.Service ?? mongoose.model("Service", serviceSchema);
export const SiteContent =
	mongoose.models.SiteContent ?? mongoose.model("SiteContent", siteContentSchema);
export const Inquiry = mongoose.models.Inquiry ?? mongoose.model("Inquiry", inquirySchema);
export const Setting = mongoose.models.Setting ?? mongoose.model("Setting", settingSchema);
export const AdminUser = mongoose.models.AdminUser ?? mongoose.model("AdminUser", adminUserSchema);
export const Policy = mongoose.models.Policy ?? mongoose.model("Policy", policySchema);
export const Group = mongoose.models.Group ?? mongoose.model("Group", groupSchema);
