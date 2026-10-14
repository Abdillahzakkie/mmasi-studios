import type { Film, Reel } from "@/types";

export const REELS: Reel[] = [
	{
		slug: "aso-oke-in-motion",
		title: "Aṣọ Òkè in Motion",
		category: "Fashion",
		duration: "0:45",
		tone: "warm",
		status: "Published",
	},
	{
		slug: "vows-ikoyi",
		title: "Vows · Ikoyi",
		category: "Weddings",
		duration: "0:32",
		tone: "portrait",
		status: "Published",
	},
	{
		slug: "house-of-lumiere-ss",
		title: "House of Lumière SS",
		category: "Commercial",
		duration: "0:58",
		tone: "cool",
		status: "Published",
	},
	{
		slug: "harmattan",
		title: "Harmattan",
		category: "Editorial",
		duration: "0:27",
		tone: "warm",
		status: "Published",
	},
	{
		slug: "first-dance",
		title: "First Dance",
		category: "Weddings",
		duration: "0:41",
		tone: "portrait",
		status: "Published",
	},
];

export const FILMS: Film[] = [
	{
		slug: "the-adeyemi-union-film",
		title: "The Adeyemi Union — The Film",
		category: "Documentary wedding",
		synopsis:
			"A full day in Ikoyi, from the family house to the last dance, cut as a story rather than a montage.",
		duration: "8:24",
		resolution: "4K UHD",
		year: 2025,
		location: "Ikoyi, Lagos",
		tone: "cool",
		status: "Published",
	},
	{
		slug: "house-of-lumiere-campaign",
		title: "House of Lumière — SS Campaign",
		category: "Brand campaign",
		synopsis: "A fashion house launch film, graded warm, scored to a licensed original.",
		duration: "2:12",
		resolution: "4K UHD",
		year: 2025,
		location: "Studio, Lagos",
		tone: "warm",
		status: "Published",
	},
];
