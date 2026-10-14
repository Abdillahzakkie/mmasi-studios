import type { Metadata } from "next";
import ContactWrapper from "@/libs/ContactWrapper";
import { getSiteContent } from "@/server/data";

export const metadata: Metadata = {
	title: "Contact — MmasiEjikeme Studios",
	description:
		"Start a session with MmasiEjikeme Studios. Build your inquiry and send it on WhatsApp — a reply within 24 hours.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
	const content = await getSiteContent();
	return <ContactWrapper banner={content.banners.contact} />;
}
