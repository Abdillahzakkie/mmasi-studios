"use client";

import { useState } from "react";
import Plate from "@/components/Plate";
import { Eyebrow, SectionHead } from "@/components/Section";
import VideoPlayer, { type VideoItem } from "@/components/VideoPlayer";
import type { Film, Reel, SiteContentData } from "@/types";
import { Band, Banner, CineCard, CineRow, ReelCard, ReelRow } from "./styled";

/**
 * The motion gallery: 9/16 vertical reels and 16/9 cinema films from the
 * database. Any card opens the themed player in the format it was shot.
 */
export default function FilmsWrapper({
	reels,
	films,
	banner,
}: {
	reels: Reel[];
	films: Film[];
	banner: SiteContentData["banners"]["films"];
}) {
	const [selected, setSelected] = useState<VideoItem | null>(null);

	const openReel = (reel: Reel) =>
		setSelected({
			title: reel.title,
			category: reel.category,
			tone: reel.tone,
			duration: reel.duration,
			format: "reel",
		});

	const openFilm = (film: Film) =>
		setSelected({
			title: film.title,
			category: film.category,
			tone: film.tone,
			duration: film.duration,
			resolution: film.resolution,
			format: "cinema",
		});

	return (
		<>
			<Banner>
				<Eyebrow>{banner.eyebrow}</Eyebrow>
				<h1>{banner.title}</h1>
				<p>{banner.intro}</p>
			</Banner>

			<Band>
				<SectionHead>
					<div>
						<Eyebrow>9:16 vertical</Eyebrow>
						<h2>Short-form reels</h2>
						<p>
							Fashion clips, ceremony highlights and brand teasers, made for the
							phone.
						</p>
					</div>
				</SectionHead>
				<ReelRow>
					{reels.map((reel) => (
						<ReelCard
							key={reel.slug}
							type="button"
							aria-label={`Play ${reel.title}`}
							onClick={() => openReel(reel)}
						>
							<Plate
								tone={reel.tone}
								ratio="9 / 16"
								src={reel.posterUrl || undefined}
								alt={reel.title}
							>
								<span className="dur">{reel.duration}</span>
								<span className="rplay" aria-hidden />
								<span className="rmeta">
									<b>{reel.title}</b>
									<span>{reel.category}</span>
								</span>
							</Plate>
						</ReelCard>
					))}
				</ReelRow>
			</Band>

			<Band>
				<SectionHead>
					<div>
						<Eyebrow>16:9 widescreen</Eyebrow>
						<h2>Cinematic productions</h2>
						<p>
							Documentary wedding films, brand campaigns and visual direction pieces.
						</p>
					</div>
				</SectionHead>
				<CineRow>
					{films.map((film) => (
						<CineCard
							key={film.slug}
							type="button"
							aria-label={`Play ${film.title}`}
							onClick={() => openFilm(film)}
						>
							<Plate
								tone={film.tone}
								ratio="16 / 9"
								src={film.posterUrl || undefined}
								alt={film.title}
							>
								<span className="res">{film.resolution}</span>
								<span className="cplay" aria-hidden />
							</Plate>
							<div className="cbody">
								<div className="ctag">{film.category}</div>
								<h4>{film.title}</h4>
								<p>{film.synopsis}</p>
								<div className="cfoot">
									<span>{film.duration}</span>
									<span aria-hidden>&middot;</span>
									<span>{film.year}</span>
									<span aria-hidden>&middot;</span>
									<span>{film.location}</span>
								</div>
							</div>
						</CineCard>
					))}
				</CineRow>
			</Band>

			{selected && <VideoPlayer item={selected} onClose={() => setSelected(null)} />}
		</>
	);
}
