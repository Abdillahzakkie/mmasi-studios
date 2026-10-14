import type { CaseStudy } from "@/types";

export const CASE_STUDIES: CaseStudy[] = [
	{
		slug: "the-adeyemi-union",
		title: "The Adeyemi Union",
		category: "Weddings & Ceremonies",
		client: "Private commission",
		location: "Ikoyi, Lagos",
		year: 2025,
		role: "Direction, stills, film",
		tone: "portrait",
		vision: "The brief was a single word: heirloom. We shot the day as a documentary — no staged recreations — and reserved the editorial portraits for the twenty minutes of light after the ceremony, when the family house emptied and the couple could breathe.",
		production:
			"Two photographers and a gimbal operator moved as one unit. Continuous cinema lighting carried the indoor reception so the film and the stills graded identically. Every frame was backed to two cards on capture.",
		frames: [
			{ tone: "warm", ratio: "16/9" },
			{ tone: "portrait", ratio: "3/2" },
			{ tone: "cool", ratio: "16/9" },
		],
	},
	{
		slug: "house-of-lumiere",
		title: "House of Lumière — SS Campaign",
		category: "Commercial & Brand",
		client: "House of Lumière",
		location: "Victoria Island, Lagos",
		year: 2025,
		role: "Art direction, stills, film",
		tone: "warm",
		vision: "A fashion house launching its first in-house line wanted the campaign to feel like a film still, not a catalogue. We built one warm key light and let the garments carry the frame.",
		production:
			"A single studio day, shot tethered. The 90-second brand film was cut from the same session so the stills and motion share one grade and one score.",
		frames: [
			{ tone: "warm", ratio: "16/9" },
			{ tone: "portrait", ratio: "4/5" },
			{ tone: "cool", ratio: "3/2" },
		],
	},
];

export function caseStudyBySlug(slug: string): CaseStudy | undefined {
	return CASE_STUDIES.find((c) => c.slug === slug);
}
