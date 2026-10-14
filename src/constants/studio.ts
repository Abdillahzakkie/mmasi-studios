/** Studio facts, used across the public site and the admin. */

export const STUDIO = {
	name: "MmasiEjikeme Studios",
	tagline: "Visual Stories. Timeless Frames.",
	whatsappNumber: "+234 814 709 9175",
	// wa.me wants digits only, no + or spaces.
	whatsappDigits: "2348147099175",
	email: "hello@mmasiejikeme.studio",
	base: "Lagos, Nigeria",
	availability: "Available worldwide",
	responseTime: "Within 24 hours",
};

export const SOCIALS = [
	{ label: "Instagram", href: "https://instagram.com/mmasiejikeme" },
	{ label: "TikTok", href: "https://tiktok.com/@mmasiejikeme" },
	{ label: "X / Twitter", href: "https://x.com/mmasiejikeme" },
	{ label: "Facebook", href: "https://facebook.com/mmasiejikeme" },
];

export const NAV = [
	{ label: "Home", href: "/" },
	{ label: "Photography", href: "/photography" },
	{ label: "Films & Reels", href: "/films" },
	{ label: "Services", href: "/services" },
	{ label: "About", href: "/about" },
	{ label: "Contact", href: "/contact" },
];

/**
 * Builds a wa.me deep link that opens WhatsApp with a message pre-filled, so
 * every inquiry begins as a warm conversation rather than a cold form.
 */
export function waLink(message?: string): string {
	const base = `https://wa.me/${STUDIO.whatsappDigits}`;
	return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** The default booking message when no service context is known. */
export const DEFAULT_WA_MESSAGE = `Hi ${STUDIO.name}, I'd like to book a session.`;

/** A service-scoped inquiry opener, used by the service cards and the lightbox. */
export function serviceWaMessage(service: string): string {
	return `Hi ${STUDIO.name}, I'd like to inquire about ${service}.`;
}
