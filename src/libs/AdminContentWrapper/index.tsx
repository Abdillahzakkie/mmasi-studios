"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { Button, Plate } from "@/components";
import MediaPicker from "@/components/MediaPicker";
import { Card, FormGrid, Muted, PaneHead, RepeatRow, Stack, Thumb } from "@/libs/adminUi";
import type { SiteContentData } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminContentWrapper() {
	const { data, mutate } = useSWR<SiteContentData>("/api/admin/content", fetcher);
	const [content, setContent] = useState<SiteContentData | null>(null);
	const [busy, setBusy] = useState(false);
	const [saved, setSaved] = useState(false);
	const [pick, setPick] = useState<{ set: (v: string) => void } | null>(null);

	useEffect(() => {
		if (data) setContent(structuredClone(data));
	}, [data]);

	/** Immutably edit the draft through a mutating updater on a clone. */
	const edit = (updater: (draft: SiteContentData) => void) =>
		setContent((prev) => {
			if (!prev) return prev;
			const next = structuredClone(prev);
			updater(next);
			return next;
		});

	const save = async () => {
		if (!content) return;
		setBusy(true);
		setSaved(false);
		try {
			await fetch("/api/admin/content", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(content),
			});
			await mutate(content, { revalidate: false });
			setSaved(true);
		} finally {
			setBusy(false);
		}
	};

	/** Renders one labelled input/textarea; a function (not a component) so inputs keep focus. */
	const field = (
		id: string,
		label: string,
		value: string,
		setValue: (v: string) => void,
		area = false,
	) => (
		<div key={id}>
			<label htmlFor={id}>{label}</label>
			{area ? (
				<textarea id={id} value={value} onChange={(e) => setValue(e.target.value)} />
			) : (
				<input id={id} value={value} onChange={(e) => setValue(e.target.value)} />
			)}
		</div>
	);

	/** An image slot: thumbnail preview + library picker + clear, bound to one URL. */
	const imageField = (
		id: string,
		label: string,
		value: string,
		setValue: (v: string) => void,
	) => (
		<div key={id}>
			{/* biome-ignore lint/a11y/noLabelWithoutControl: labels a media picker */}
			<label>{label}</label>
			<div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
				<Thumb>
					<Plate tone="warm" ratio="1/1" src={value || undefined} alt="" />
				</Thumb>
				<div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
					<Button variant="outline" size="sm" onClick={() => setPick({ set: setValue })}>
						{value ? "Change image" : "Choose from library"}
					</Button>
					{value && (
						<Button variant="ghost" size="sm" onClick={() => setValue("")}>
							Clear
						</Button>
					)}
				</div>
			</div>
		</div>
	);

	if (!content) return <Muted>Loading content…</Muted>;

	const c = content;
	const banners: { key: keyof SiteContentData["banners"]; label: string }[] = [
		{ key: "photography", label: "Photography banner" },
		{ key: "films", label: "Films banner" },
		{ key: "services", label: "Services banner" },
		{ key: "contact", label: "Contact banner" },
	];

	return (
		<>
			<PaneHead>
				<div>
					<h1>Site content</h1>
					<p>Editable copy across the public pages. One save writes it all.</p>
				</div>
				<div className="actions">
					{saved && <Muted>Saved.</Muted>}
					<Button variant="pri" onClick={save}>
						{busy ? "Saving…" : "Save content"}
					</Button>
				</div>
			</PaneHead>

			<Stack>
				<Card>
					<h2>Home · hero</h2>
					<FormGrid>
						{field("h-eyebrow", "Eyebrow", c.home.hero.eyebrow, (v) =>
							edit((d) => {
								d.home.hero.eyebrow = v;
							}),
						)}
						{field(
							"h-title",
							"Title (line breaks become new lines on the site)",
							c.home.hero.title,
							(v) =>
								edit((d) => {
									d.home.hero.title = v;
								}),
							true,
						)}
						{field("h-sub", "Subtitle", c.home.hero.sub, (v) =>
							edit((d) => {
								d.home.hero.sub = v;
							}),
						)}
						<div className="row2">
							{field("h-pcta", "Primary CTA", c.home.hero.primaryCta, (v) =>
								edit((d) => {
									d.home.hero.primaryCta = v;
								}),
							)}
							{field("h-scta", "Secondary CTA", c.home.hero.secondaryCta, (v) =>
								edit((d) => {
									d.home.hero.secondaryCta = v;
								}),
							)}
						</div>
					</FormGrid>
				</Card>

				<Card>
					<h2>Home · selected work</h2>
					<FormGrid>
						<div className="row2">
							{field("s-eyebrow", "Eyebrow", c.home.selected.eyebrow, (v) =>
								edit((d) => {
									d.home.selected.eyebrow = v;
								}),
							)}
							{field("s-cta", "CTA", c.home.selected.cta, (v) =>
								edit((d) => {
									d.home.selected.cta = v;
								}),
							)}
						</div>
						{field("s-title", "Title", c.home.selected.title, (v) =>
							edit((d) => {
								d.home.selected.title = v;
							}),
						)}
					</FormGrid>
				</Card>

				<Card>
					<h2>Home · showreel</h2>
					<FormGrid>
						<div className="row2">
							{field("sr-eyebrow", "Eyebrow", c.home.showreel.eyebrow, (v) =>
								edit((d) => {
									d.home.showreel.eyebrow = v;
								}),
							)}
							{field("sr-runtime", "Runtime", c.home.showreel.runtime, (v) =>
								edit((d) => {
									d.home.showreel.runtime = v;
								}),
							)}
						</div>
						{field("sr-title", "Title", c.home.showreel.title, (v) =>
							edit((d) => {
								d.home.showreel.title = v;
							}),
						)}
						{field(
							"sr-blurb",
							"Blurb",
							c.home.showreel.blurb,
							(v) =>
								edit((d) => {
									d.home.showreel.blurb = v;
								}),
							true,
						)}
						<div className="row2">
							{field("sr-ctitle", "Card title", c.home.showreel.cardTitle, (v) =>
								edit((d) => {
									d.home.showreel.cardTitle = v;
								}),
							)}
							{field("sr-csub", "Card subtitle", c.home.showreel.cardSub, (v) =>
								edit((d) => {
									d.home.showreel.cardSub = v;
								}),
							)}
						</div>
					</FormGrid>
				</Card>

				<Card>
					<h2>Home · artist statement</h2>
					<FormGrid>
						{field(
							"a-pull",
							"Pull quote",
							c.home.artist.pullquote,
							(v) =>
								edit((d) => {
									d.home.artist.pullquote = v;
								}),
							true,
						)}
						<div className="row2">
							{field("a-byline", "Byline", c.home.artist.byline, (v) =>
								edit((d) => {
									d.home.artist.byline = v;
								}),
							)}
							{field("a-cta", "CTA", c.home.artist.cta, (v) =>
								edit((d) => {
									d.home.artist.cta = v;
								}),
							)}
						</div>
						{field(
							"a-bio",
							"Bio",
							c.home.artist.bio,
							(v) =>
								edit((d) => {
									d.home.artist.bio = v;
								}),
							true,
						)}
					</FormGrid>
				</Card>

				<Card>
					<h2>Home · WhatsApp callout</h2>
					<FormGrid>
						{field("cl-heading", "Heading", c.home.callout.heading, (v) =>
							edit((d) => {
								d.home.callout.heading = v;
							}),
						)}
						{field(
							"cl-body",
							"Body",
							c.home.callout.body,
							(v) =>
								edit((d) => {
									d.home.callout.body = v;
								}),
							true,
						)}
						{field("cl-cta", "CTA", c.home.callout.cta, (v) =>
							edit((d) => {
								d.home.callout.cta = v;
							}),
						)}
					</FormGrid>
				</Card>

				<Card>
					<h2>About</h2>
					<FormGrid>
						<div className="row2">
							{field("ab-eyebrow", "Banner eyebrow", c.about.bannerEyebrow, (v) =>
								edit((d) => {
									d.about.bannerEyebrow = v;
								}),
							)}
							{field("ab-title", "Banner title", c.about.bannerTitle, (v) =>
								edit((d) => {
									d.about.bannerTitle = v;
								}),
							)}
						</div>
						{field(
							"ab-pull",
							"Pull quote",
							c.about.pullquote,
							(v) =>
								edit((d) => {
									d.about.pullquote = v;
								}),
							true,
						)}
						{field("ab-byline", "Byline", c.about.byline, (v) =>
							edit((d) => {
								d.about.byline = v;
							}),
						)}
						{field(
							"ab-bio",
							"Bio",
							c.about.bio,
							(v) =>
								edit((d) => {
									d.about.bio = v;
								}),
							true,
						)}
						<div className="row2">
							{field("ab-keyebrow", "Kit eyebrow", c.about.kitEyebrow, (v) =>
								edit((d) => {
									d.about.kitEyebrow = v;
								}),
							)}
							{field("ab-ktitle", "Kit title", c.about.kitTitle, (v) =>
								edit((d) => {
									d.about.kitTitle = v;
								}),
							)}
						</div>
						{field(
							"ab-kblurb",
							"Kit blurb",
							c.about.kitBlurb,
							(v) =>
								edit((d) => {
									d.about.kitBlurb = v;
								}),
							true,
						)}
					</FormGrid>

					<h2 style={{ marginTop: "18px" }}>Kit groups</h2>
					<Stack>
						{c.about.kit.map((g, gi) => (
							<Card key={gi}>
								<FormGrid>
									{field(`kit-h-${gi}`, "Group heading", g.heading, (v) =>
										edit((d) => {
											d.about.kit[gi].heading = v;
										}),
									)}
									{g.items.map((it, ii) => (
										<RepeatRow key={ii}>
											<div>
												<label htmlFor={`kit-n-${gi}-${ii}`}>Name</label>
												<input
													id={`kit-n-${gi}-${ii}`}
													value={it.name}
													onChange={(e) =>
														edit((d) => {
															d.about.kit[gi].items[ii].name =
																e.target.value;
														})
													}
												/>
											</div>
											<div>
												<label htmlFor={`kit-note-${gi}-${ii}`}>Note</label>
												<input
													id={`kit-note-${gi}-${ii}`}
													value={it.note}
													onChange={(e) =>
														edit((d) => {
															d.about.kit[gi].items[ii].note =
																e.target.value;
														})
													}
												/>
											</div>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													edit((d) => {
														d.about.kit[gi].items.splice(ii, 1);
													})
												}
											>
												Remove
											</Button>
										</RepeatRow>
									))}
									<div className="row2">
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												edit((d) => {
													d.about.kit[gi].items.push({
														name: "",
														note: "",
													});
												})
											}
										>
											Add item
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() =>
												edit((d) => {
													d.about.kit.splice(gi, 1);
												})
											}
										>
											Remove group
										</Button>
									</div>
								</FormGrid>
							</Card>
						))}
						<Button
							variant="outline"
							size="sm"
							onClick={() =>
								edit((d) => {
									d.about.kit.push({ heading: "", items: [] });
								})
							}
						>
							Add kit group
						</Button>
					</Stack>
				</Card>

				<Card>
					<h2>Page images</h2>
					<Muted>
						Shown on the home and about pages. Leave empty to use the gradient
						placeholder.
					</Muted>
					<FormGrid>
						{imageField(
							"img-hero",
							"Home hero background",
							c.home.hero.image ?? "",
							(v) =>
								edit((d) => {
									d.home.hero.image = v;
								}),
						)}
						{imageField(
							"img-showreel",
							"Home showreel poster",
							c.home.showreel.image ?? "",
							(v) =>
								edit((d) => {
									d.home.showreel.image = v;
								}),
						)}
						{imageField(
							"img-artist",
							"Home artist portrait",
							c.home.artist.portrait ?? "",
							(v) =>
								edit((d) => {
									d.home.artist.portrait = v;
								}),
						)}
						{imageField(
							"img-about",
							"About page portrait",
							c.about.portrait ?? "",
							(v) =>
								edit((d) => {
									d.about.portrait = v;
								}),
						)}
					</FormGrid>
				</Card>

				<Card>
					<h2>Services · callout</h2>
					<FormGrid>
						{field("sc-heading", "Heading", c.services.calloutHeading, (v) =>
							edit((d) => {
								d.services.calloutHeading = v;
							}),
						)}
						{field(
							"sc-body",
							"Body",
							c.services.calloutBody,
							(v) =>
								edit((d) => {
									d.services.calloutBody = v;
								}),
							true,
						)}
						{field("sc-cta", "CTA", c.services.calloutCta, (v) =>
							edit((d) => {
								d.services.calloutCta = v;
							}),
						)}
					</FormGrid>
				</Card>

				{banners.map((b) => (
					<Card key={b.key}>
						<h2>{b.label}</h2>
						<FormGrid>
							<div className="row2">
								{field(
									`bn-${b.key}-eyebrow`,
									"Eyebrow",
									c.banners[b.key].eyebrow,
									(v) =>
										edit((d) => {
											d.banners[b.key].eyebrow = v;
										}),
								)}
								{field(`bn-${b.key}-title`, "Title", c.banners[b.key].title, (v) =>
									edit((d) => {
										d.banners[b.key].title = v;
									}),
								)}
							</div>
							{field(
								`bn-${b.key}-intro`,
								"Intro",
								c.banners[b.key].intro,
								(v) =>
									edit((d) => {
										d.banners[b.key].intro = v;
									}),
								true,
							)}
						</FormGrid>
					</Card>
				))}
			</Stack>

			{pick && (
				<MediaPicker
					accept="image"
					onPick={({ url }) => {
						pick.set(url);
						setPick(null);
					}}
					onClose={() => setPick(null)}
				/>
			)}
		</>
	);
}
