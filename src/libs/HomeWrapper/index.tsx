"use client";

import { Fragment } from "react";
import { Button, Container, Eyebrow, Section, SectionHead } from "@/components";
import { DEFAULT_WA_MESSAGE, waLink } from "@/constants/studio";
import type { SiteContentData, Tone } from "@/types";
import {
	ArtistBand,
	ArtistBio,
	FillPlate,
	Hero,
	HeroBody,
	HeroCta,
	HlGrid,
	HlTile,
	Portrait,
	Pullquote,
	ScrollCue,
	Showreel,
	ShowreelMeta,
	ShowreelPlay,
	TileMeta,
	WaCallout,
	Zoomcue,
} from "./styled";

export interface HomePhoto {
	slug: string;
	title: string;
	category: string;
	year: number;
	tone: Tone;
	imageUrl?: string;
}

// The asymmetric highlights grid draws the first frames big/tall/square.
const SIZES: ("big" | "tall" | "sq")[] = ["big", "tall", "sq", "sq", "sq"];

export default function HomeWrapper({
	photos,
	caseStudySlugs,
	home,
}: {
	photos: HomePhoto[];
	caseStudySlugs: string[];
	home: SiteContentData["home"];
}) {
	const hasCase = new Set(caseStudySlugs);
	const highlights = photos.slice(0, SIZES.length);

	return (
		<>
			<Hero>
				<FillPlate tone="warm" src={home.hero.image || undefined} alt="" />
				<Container>
					<HeroBody>
						<Eyebrow>{home.hero.eyebrow}</Eyebrow>
						<h1>
							{home.hero.title.split("\n").map((line, i) => (
								<Fragment key={line}>
									{i > 0 && <br />}
									{line}
								</Fragment>
							))}
						</h1>
						<p>{home.hero.sub}</p>
						<HeroCta>
							<Button variant="wa" size="lg" href={waLink(DEFAULT_WA_MESSAGE)}>
								{home.hero.primaryCta}
							</Button>
							<Button variant="outline" size="lg" href="/photography">
								{home.hero.secondaryCta}
							</Button>
						</HeroCta>
					</HeroBody>
				</Container>
				<ScrollCue>Scroll</ScrollCue>
			</Hero>

			<Section>
				<Container>
					<SectionHead>
						<div>
							<Eyebrow>{home.selected.eyebrow}</Eyebrow>
							<h2>{home.selected.title}</h2>
						</div>
						<Button className="trail" variant="outline" href="/photography">
							{home.selected.cta}
						</Button>
					</SectionHead>
					<HlGrid>
						{highlights.map((photo, i) => {
							const href = hasCase.has(photo.slug)
								? `/work/${photo.slug}`
								: "/photography";
							return (
								<HlTile key={photo.slug} href={href} $size={SIZES[i]}>
									<FillPlate
										tone={photo.tone}
										src={photo.imageUrl || undefined}
										alt={photo.title}
									/>
									<Zoomcue className="zoomcue" aria-hidden>
										+
									</Zoomcue>
									<TileMeta>
										<b>{photo.title}</b>
										<span>
											{photo.category} &middot; {photo.year}
										</span>
									</TileMeta>
								</HlTile>
							);
						})}
					</HlGrid>
				</Container>
			</Section>

			<Section $flush>
				<Container>
					<SectionHead>
						<div>
							<Eyebrow>{home.showreel.eyebrow}</Eyebrow>
							<h2>{home.showreel.title}</h2>
							<p>{home.showreel.blurb}</p>
						</div>
					</SectionHead>
					<Showreel href="/films" aria-label="Watch the 2025 showreel">
						<FillPlate tone="cool" src={home.showreel.image || undefined} alt="" />
						<ShowreelPlay aria-hidden />
						<ShowreelMeta>
							<b>{home.showreel.cardTitle}</b>
							<span>{home.showreel.cardSub}</span>
							<span className="runtime">{home.showreel.runtime}</span>
						</ShowreelMeta>
					</Showreel>
				</Container>
			</Section>

			<Section $flush>
				<Container>
					<ArtistBand>
						<Portrait
							tone="portrait"
							ratio="4/5"
							src={home.artist.portrait || undefined}
							alt=""
						/>
						<div>
							<Pullquote>
								&ldquo;{home.artist.pullquote}&rdquo;
								<span className="by">{home.artist.byline}</span>
							</Pullquote>
							<ArtistBio>{home.artist.bio}</ArtistBio>
							<Button variant="outline" href="/about">
								{home.artist.cta}
							</Button>
						</div>
					</ArtistBand>
				</Container>
			</Section>

			<Section $flush>
				<Container>
					<WaCallout>
						<div className="wtext">
							<h3>{home.callout.heading}</h3>
							<p>{home.callout.body}</p>
						</div>
						<Button variant="wa" size="lg" href={waLink(DEFAULT_WA_MESSAGE)}>
							{home.callout.cta}
						</Button>
					</WaCallout>
				</Container>
			</Section>
		</>
	);
}
