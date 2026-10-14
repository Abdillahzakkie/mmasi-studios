import type { KitGroup, Service } from "@/types";

export const SERVICES: Service[] = [
	{
		slug: "editorial-portraits",
		tag: "Portraiture",
		title: "Editorial & Portrait Sessions",
		description: "Personal portraiture, executive profiles and haute-couture monographs.",
		investment: "from ₦250,000",
		investmentNote: "/ half-day",
		deliverables: [
			"2 hours of coverage, one location",
			"25 retouched editorial stills",
			"Online master gallery",
			"7-day turnaround",
		],
	},
	{
		slug: "wedding-stills-film",
		tag: "Most requested",
		title: "Wedding Stills & Film",
		description:
			"Documentary coverage with editorial couple portraits and a cinema highlight film.",
		investment: "from ₦1,800,000",
		investmentNote: "/ full day",
		deliverables: [
			"Up to 10 hours, two photographers",
			"400+ edited stills",
			"3–5 min 4K highlight film",
			"Heirloom web gallery & prints",
		],
		feature: true,
	},
	{
		slug: "commercial-campaigns",
		tag: "Brands",
		title: "Commercial Campaigns",
		description: "Visual identity, lookbooks, product campaigns and brand films.",
		investment: "on request",
		investmentNote: "/ scoped per brief",
		deliverables: [
			"Art direction & moodboard",
			"Stills + motion deliverables",
			"Licensed usage rights",
			"Named turnaround in the proposal",
		],
	},
	{
		slug: "short-form-content",
		tag: "Social",
		title: "Short-Form Content",
		description: "9:16 reels for fashion, ceremony highlights and brand teasers.",
		investment: "from ₦180,000",
		investmentNote: "/ reel day",
		deliverables: [
			"Half-day capture",
			"3–5 vertical reels",
			"Platform-ready exports",
			"5-day turnaround",
		],
	},
	{
		slug: "custom-monographs",
		tag: "Bespoke",
		title: "Custom Monographs",
		description: "A one-of-one body of work: editorial direction, print and archival master.",
		investment: "from ₦900,000",
		investmentNote: "/ project",
		deliverables: [
			"Concept & direction",
			"Full-day capture",
			"Fine-art print edition",
			"Archival master files",
		],
	},
	{
		slug: "tell-us-your-vision",
		tag: "Not sure?",
		title: "Tell us your vision",
		description: "Describe what you are planning and the studio will shape a tier around it.",
		investment: "A reply within 24 hours",
		investmentNote: "",
		deliverables: [
			"No obligation",
			"Mood & scope discussed on chat",
			"A transparent proposal",
			"Dates held on retainer",
		],
	},
];

export const KIT: KitGroup[] = [
	{
		heading: "Camera bodies",
		items: [
			{ name: "Sony Cinema FX3", note: "motion" },
			{ name: "Sony Alpha 1", note: "50MP stills" },
			{ name: "Fujifilm GFX", note: "medium format" },
		],
	},
	{
		heading: "Prime optics",
		items: [
			{ name: "Leica Summilux 50mm", note: "f/1.4" },
			{ name: "Sony G Master 85mm", note: "f/1.4" },
			{ name: "Sony G Master 35mm", note: "f/1.4" },
		],
	},
	{
		heading: "Light & stabilisation",
		items: [
			{ name: "Continuous cinema fixtures", note: "soft, directional" },
			{ name: "Softboxes & scrims", note: "studio" },
			{ name: "Gimbal & pro drone", note: "motion" },
		],
	},
];
