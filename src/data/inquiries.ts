import type { Inquiry } from "@/types";

/**
 * Static inquiry records for the admin UI. In a wired build these come from the
 * API; here they drive the table, the detail view and the status workflow so the
 * screens are real to click through.
 */
export const INQUIRIES: Inquiry[] = [
	{
		id: "INQ-2041",
		name: "Amaka Eze",
		phone: "+234 803 221 7781",
		service: "Wedding Stills & Film",
		date: "14 Dec 2025",
		location: "Calabar, Cross River",
		vision: "Traditional ceremony in the morning, white wedding at 4pm. We want the documentary feel from The Adeyemi Union, plus a 3-minute highlight film.",
		status: "New",
		receivedAt: "2025-10-11 09:24",
	},
	{
		id: "INQ-2040",
		name: "Emeka Nwachukwu",
		phone: "+234 806 554 2211",
		service: "Editorial & Portrait Sessions",
		date: "To be confirmed",
		location: "Ikoyi, Lagos",
		vision: "",
		status: "Under review",
		receivedAt: "2025-10-10 18:02",
	},
	{
		id: "INQ-2038",
		name: "House of Lumière",
		phone: "+234 701 889 0012",
		service: "Commercial Campaigns",
		date: "20–22 Nov 2025",
		location: "Victoria Island, Lagos",
		vision: "SS26 lookbook: 40 stills and a 90-second brand film, warm grade.",
		status: "Booked",
		receivedAt: "2025-10-08 11:47",
	},
	{
		id: "INQ-2033",
		name: "Tobi & Zainab",
		phone: "+234 802 110 5567",
		service: "Wedding Stills & Film",
		date: "4 Oct 2025",
		location: "Obudu, Cross River",
		vision: "Destination wedding on the plateau. Delivered.",
		status: "Completed",
		receivedAt: "2025-09-02 14:15",
	},
];

export function inquiryById(id: string): Inquiry | undefined {
	return INQUIRIES.find((i) => i.id === id);
}
