import type { Metadata } from "next";
import PhotographyWrapper from "@/libs/PhotographyWrapper";
import { getPhotos, getSiteContent } from "@/server/data";
import type { Photo } from "@/types";

export const metadata: Metadata = {
	title: "Photography — MmasiEjikeme Studios",
};

export const dynamic = "force-dynamic";

export default async function PhotographyPage() {
	const [photos, content] = await Promise.all([
		getPhotos({ publishedOnly: true }),
		getSiteContent(),
	]);
	// DB docs carry string enums; cast at the server→client boundary.
	return (
		<PhotographyWrapper
			photos={photos as unknown as Photo[]}
			banner={content.banners.photography}
		/>
	);
}
