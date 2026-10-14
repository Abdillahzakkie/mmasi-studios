export type Tone = "warm" | "cool" | "portrait";

export type Category =
	| "Portraits"
	| "Weddings & Ceremonies"
	| "Fashion & Editorial"
	| "Commercial & Brand"
	| "Events";

export interface Photo {
	slug: string;
	title: string;
	category: Category;
	location: string;
	year: number;
	camera: string;
	lens: string;
	caption: string;
	tone: Tone;
	/** Rough aspect ratio for the masonry/plate, e.g. "4/5". */
	ratio: string;
	featured?: boolean;
	status?: "Published" | "Draft";
	/** Present on DB-backed records. */
	id?: string;
	imageUrl?: string;
}

export interface Reel {
	slug: string;
	title: string;
	category: string;
	duration: string;
	tone: Tone;
	status?: "Published" | "Draft";
	id?: string;
	posterUrl?: string;
	videoUrl?: string;
}

export interface Film {
	slug: string;
	title: string;
	category: string;
	synopsis: string;
	duration: string;
	resolution: string;
	year: number;
	location: string;
	tone: Tone;
	status?: "Published" | "Draft";
	id?: string;
	posterUrl?: string;
	videoUrl?: string;
}

export interface Service {
	slug: string;
	tag: string;
	title: string;
	description: string;
	investment: string;
	investmentNote: string;
	deliverables: string[];
	feature?: boolean;
}

export interface KitGroup {
	heading: string;
	items: { name: string; note: string }[];
}

export interface CaseStudy {
	slug: string;
	title: string;
	category: Category;
	client: string;
	location: string;
	year: number;
	role: string;
	tone: Tone;
	vision: string;
	production: string;
	frames: { tone: Tone; ratio: string; imageUrl?: string }[];
	id?: string;
	coverUrl?: string;
}

/** A page's editorial intro: eyebrow kicker, heading, lead paragraph. */
export interface ContentBanner {
	eyebrow: string;
	title: string;
	intro: string;
}

/**
 * All editable page copy, stored as one keyed document and edited from the
 * admin Content editor. `DEFAULT_CONTENT` (src/data/content.ts) is both the
 * seed source and the runtime fallback, so the shape here is the contract the
 * public wrappers, the admin editor and the seed all share.
 */
export interface SiteContentData {
	home: {
		/** Hero title may hold a line break as `\n`. `image` (optional) backs the hero. */
		hero: {
			eyebrow: string;
			title: string;
			sub: string;
			primaryCta: string;
			secondaryCta: string;
			image?: string;
		};
		selected: { eyebrow: string; title: string; cta: string };
		showreel: {
			eyebrow: string;
			title: string;
			blurb: string;
			cardTitle: string;
			cardSub: string;
			runtime: string;
			/** Poster image for the showreel card; falls back to the gradient. */
			image?: string;
		};
		artist: { pullquote: string; byline: string; bio: string; cta: string; portrait?: string };
		callout: { heading: string; body: string; cta: string };
	};
	about: {
		bannerEyebrow: string;
		bannerTitle: string;
		pullquote: string;
		byline: string;
		bio: string;
		kitEyebrow: string;
		kitTitle: string;
		kitBlurb: string;
		kit: KitGroup[];
		/** Portrait beside the About pull quote; falls back to the gradient. */
		portrait?: string;
	};
	services: { calloutHeading: string; calloutBody: string; calloutCta: string };
	banners: {
		photography: ContentBanner;
		films: ContentBanner;
		services: ContentBanner;
		contact: ContentBanner;
	};
}

export type InquiryStatus = "New" | "Under review" | "Booked" | "Completed";

export interface Inquiry {
	id: string;
	name: string;
	phone: string;
	service: string;
	date: string;
	location: string;
	vision: string;
	status: InquiryStatus;
	receivedAt: string;
}
