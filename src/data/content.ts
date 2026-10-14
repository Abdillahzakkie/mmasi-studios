import type { SiteContentData } from "@/types";
import { KIT } from "./services";

/**
 * The copy that ships on a fresh install. The seed writes it into the
 * SiteContent document and the public pages fall back to it when the database
 * has none, so editing a field in the admin Content editor overrides exactly
 * one of these strings.
 */
export const DEFAULT_CONTENT: SiteContentData = {
	home: {
		hero: {
			eyebrow: "Fine-art photography & cinematography",
			title: "Visual Stories.\nTimeless Frames.",
			sub: "Editorial portraiture, luxury weddings and cinema-grade motion for people and brands who want work that outlives the moment.",
			primaryCta: "Book a session on WhatsApp",
			secondaryCta: "Explore the work",
		},
		selected: {
			eyebrow: "Selected work",
			title: "Frames worth the wait",
			cta: "View the full portfolio",
		},
		showreel: {
			eyebrow: "Cinematography",
			title: "The 2025 showreel",
			blurb: "Three minutes of weddings, fashion film and brand work, graded on cinema systems.",
			cardTitle: "MmasiEjikeme — Reel 2025",
			cardSub: "Documentary weddings, editorial fashion, brand campaigns",
			runtime: "3:08 · 4K",
		},
		artist: {
			pullquote:
				"Every frame is a deliberate dialogue between natural light, raw emotion and timeless elegance.",
			byline: "MmasiEjikeme · Founder & Director",
			bio: "Based in Lagos and working worldwide, the studio rejects fast-fashion filters and formulaic templates. Each shoot is built on patience, lighting mastery and storytelling depth.",
			cta: "Read the full story & kit",
		},
		callout: {
			heading: "Have a date in mind?",
			body: "Tell the studio what you are planning. Bookings begin as a warm conversation on WhatsApp, not a cold form — and you get a reply within 24 hours.",
			cta: "Start on WhatsApp",
		},
	},
	about: {
		bannerEyebrow: "The studio",
		bannerTitle: "About MmasiEjikeme",
		pullquote:
			"I photograph people the way they will want to be remembered — quiet, dignified, lit by their own moment.",
		byline: "MmasiEjikeme",
		bio: "The studio began with a single prime lens and a refusal to chase trends. Years of weddings, editorial sittings and brand work later, the discipline is unchanged: observe, light deliberately, and let the frame carry a story. The studio works from Lagos and travels for destination commissions across Nigeria and beyond.",
		kitEyebrow: "Behind the craft",
		kitTitle: "The production kit",
		kitBlurb:
			"Redundancy is not optional at this tier — two bodies, backed lenses, and a lighting rig that does not depend on the weather.",
		kit: KIT,
	},
	services: {
		calloutHeading: "Still deciding between two tiers?",
		calloutBody:
			"Send the studio your date and a sentence about the project. You will get an honest recommendation, not a hard sell.",
		calloutCta: "Ask on WhatsApp",
	},
	banners: {
		photography: {
			eyebrow: "The monograph",
			title: "Photography",
			intro: "Portraits, sacred unions, fashion editorials and brand campaigns — curated, not dumped. Tap any frame to open it in the darkroom viewer with its full technical record.",
		},
		films: {
			eyebrow: "Motion",
			title: "Films & Reels",
			intro: "Short-form vertical reels built for mobile and social, and full widescreen cinema productions shot on cinema systems with professional color grading.",
		},
		services: {
			eyebrow: "Investment",
			title: "Services",
			intro: "Clear tiers, honest deliverables, and transparent investment guidance so you know which package fits before you ever reach out.",
		},
		contact: {
			eyebrow: "Let's begin",
			title: "Start your session",
			intro: "Fill in what you know. The studio replies within 24 hours — and the button opens WhatsApp with everything already written, so you never retype a thing.",
		},
	},
};
