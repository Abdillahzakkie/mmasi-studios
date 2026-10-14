import type { Metadata } from "next";
import FilmsWrapper from "@/libs/FilmsWrapper";
import { getFilms, getReels, getSiteContent } from "@/server/data";
import type { Film, Reel } from "@/types";

export const metadata: Metadata = {
	title: "Films & Reels — MmasiEjikeme Studios",
};

export const dynamic = "force-dynamic";

export default async function FilmsPage() {
	const [reels, films, content] = await Promise.all([
		getReels({ publishedOnly: true }),
		getFilms({ publishedOnly: true }),
		getSiteContent(),
	]);
	return (
		<FilmsWrapper
			reels={reels as unknown as Reel[]}
			films={films as unknown as Film[]}
			banner={content.banners.films}
		/>
	);
}
