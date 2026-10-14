import type { Metadata } from "next";
import AboutWrapper from "@/libs/AboutWrapper";
import { getSiteContent } from "@/server/data";

export const metadata: Metadata = {
	title: "About — MmasiEjikeme Studios",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
	const content = await getSiteContent();
	return <AboutWrapper about={content.about} />;
}
