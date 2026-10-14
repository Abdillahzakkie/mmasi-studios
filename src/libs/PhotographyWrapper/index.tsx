"use client";

import { useMemo, useState } from "react";
import Lightbox from "@/components/Lightbox";
import Plate from "@/components/Plate";
import { Eyebrow } from "@/components/Section";
import { CATEGORIES } from "@/data";
import type { Photo, SiteContentData } from "@/types";
import { Banner, Masonry, Shot, Tab, Tabs } from "./styled";

type Filter = (typeof CATEGORIES)[number];

/**
 * The photography monograph: an editorial banner, discipline filter pills, and a
 * masonry of the stills that opens the darkroom viewer over the filtered list.
 * Photos come from the database (passed by the server page).
 */
export default function PhotographyWrapper({
	photos: all,
	banner,
}: {
	photos: Photo[];
	banner: SiteContentData["banners"]["photography"];
}) {
	const [filter, setFilter] = useState<Filter>("All");
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const photos = useMemo(
		() => (filter === "All" ? all : all.filter((p) => p.category === filter)),
		[filter, all],
	);

	return (
		<>
			<Banner>
				<Eyebrow>{banner.eyebrow}</Eyebrow>
				<h1>{banner.title}</h1>
				<p>{banner.intro}</p>
			</Banner>

			<Tabs role="group" aria-label="Filter photographs by discipline">
				{CATEGORIES.map((c) => (
					<Tab
						key={c}
						type="button"
						$on={filter === c}
						aria-pressed={filter === c}
						onClick={() => {
							setFilter(c);
							setOpenIndex(null);
						}}
					>
						{c}
					</Tab>
				))}
			</Tabs>

			{photos.length === 0 ? (
				<Banner>
					<p>No photographs in this category yet.</p>
				</Banner>
			) : (
				<Masonry>
					{photos.map((p, i) => (
						<Shot
							key={p.slug}
							type="button"
							aria-label={`Open ${p.title}`}
							onClick={() => setOpenIndex(i)}
						>
							<Plate
								tone={p.tone}
								ratio={p.ratio}
								src={p.imageUrl || undefined}
								alt={p.title}
							/>
							<span className="cap">
								<b>{p.title}</b>
								<span>
									{p.category} &middot; {p.location}
								</span>
							</span>
						</Shot>
					))}
				</Masonry>
			)}

			{openIndex !== null && photos[openIndex] && (
				<Lightbox
					photos={photos}
					index={openIndex}
					onClose={() => setOpenIndex(null)}
					onIndex={setOpenIndex}
				/>
			)}
		</>
	);
}
