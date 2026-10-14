"use client";

import { Container, Eyebrow, Section, SectionHead } from "@/components";
import type { SiteContentData } from "@/types";
import { ArtistBand, ArtistBio, Banner, KitCard, KitGrid, Portrait, Pullquote } from "./styled";

export default function AboutWrapper({ about }: { about: SiteContentData["about"] }) {
	return (
		<>
			<Container>
				<Banner>
					<Eyebrow>{about.bannerEyebrow}</Eyebrow>
					<h1>{about.bannerTitle}</h1>
				</Banner>
			</Container>

			<Section>
				<Container>
					<ArtistBand>
						<Portrait
							tone="portrait"
							ratio="4/5"
							src={about.portrait || undefined}
							alt=""
						/>
						<div>
							<Pullquote>
								&ldquo;{about.pullquote}&rdquo;
								<span className="by">{about.byline}</span>
							</Pullquote>
							<ArtistBio>{about.bio}</ArtistBio>
						</div>
					</ArtistBand>
				</Container>
			</Section>

			<Section $flush>
				<Container>
					<SectionHead>
						<div>
							<Eyebrow>{about.kitEyebrow}</Eyebrow>
							<h2>{about.kitTitle}</h2>
							<p>{about.kitBlurb}</p>
						</div>
					</SectionHead>
					<KitGrid>
						{about.kit.map((group) => (
							<KitCard key={group.heading}>
								<h4>{group.heading}</h4>
								<ul>
									{group.items.map((item) => (
										<li key={item.name}>
											{item.name}
											<span>{item.note}</span>
										</li>
									))}
								</ul>
							</KitCard>
						))}
					</KitGrid>
				</Container>
			</Section>
		</>
	);
}
