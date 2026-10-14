import type { Metadata } from "next";
import HomeWrapper, { type HomePhoto } from "@/libs/HomeWrapper";
import { getCaseStudies, getPhotos, getSiteContent } from "@/server/data";

export const metadata: Metadata = {
	title: "MmasiEjikeme Studios — Visual Stories. Timeless Frames.",
};

// Render on each request so admin edits appear immediately.
export const dynamic = "force-dynamic";

export default async function HomePage() {
	const [photos, cases, content] = await Promise.all([
		getPhotos({ publishedOnly: true }),
		getCaseStudies(),
		getSiteContent(),
	]);
	return (
		<HomeWrapper
			photos={photos as unknown as HomePhoto[]}
			caseStudySlugs={cases.map((c) => String(c.slug))}
			home={content.home}
		/>
	);
}
