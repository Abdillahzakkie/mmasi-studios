"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button, Plate } from "@/components";
import MediaPicker from "@/components/MediaPicker";
import { CATEGORIES } from "@/data";
import {
	Card,
	EmptyBox,
	FormGrid,
	Muted,
	PaneHead,
	PreviewFrame,
	PreviewMeta,
	RepeatRow,
	Split,
	Stack,
	TableCard,
} from "@/libs/adminUi";
import type { Tone } from "@/types";

interface Frame {
	tone: Tone;
	ratio: string;
	imageUrl: string;
}

interface ApiCaseStudy {
	id: string;
	slug: string;
	title: string;
	category: string;
	client: string;
	location: string;
	year: number;
	role: string;
	tone: Tone;
	vision: string;
	production: string;
	coverUrl: string;
	frames: Frame[];
}

const EDIT_CATEGORIES = CATEGORIES.filter((c) => c !== "All");
const TONES: Tone[] = ["warm", "cool", "portrait"];
const fetcher = (url: string) => fetch(url).then((r) => r.json());
const slugify = (s: string) =>
	s
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");

type PickTarget = { kind: "cover" } | { kind: "frame"; index: number };

function CaseStudyForm({ study, onDone }: { study: ApiCaseStudy | null; onDone: () => void }) {
	const [title, setTitle] = useState(study?.title ?? "");
	const [category, setCategory] = useState<string>(study?.category ?? "Weddings & Ceremonies");
	const [client, setClient] = useState(study?.client ?? "");
	const [location, setLocation] = useState(study?.location ?? "");
	const [year, setYear] = useState(String(study?.year ?? new Date().getFullYear()));
	const [role, setRole] = useState(study?.role ?? "");
	const [tone, setTone] = useState<Tone>(study?.tone ?? "portrait");
	const [vision, setVision] = useState(study?.vision ?? "");
	const [production, setProduction] = useState(study?.production ?? "");
	const [coverUrl, setCoverUrl] = useState(study?.coverUrl ?? "");
	const [frames, setFrames] = useState<Frame[]>(study?.frames ?? []);
	const [picking, setPicking] = useState<PickTarget | null>(null);
	const [busy, setBusy] = useState(false);

	const setFrame = (index: number, patch: Partial<Frame>) =>
		setFrames((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
	const addFrame = () =>
		setFrames((prev) => [...prev, { tone: "warm", ratio: "4/5", imageUrl: "" }]);
	const removeFrame = (index: number) => setFrames((prev) => prev.filter((_, i) => i !== index));

	const onPick = (sel: { url: string }) => {
		if (picking?.kind === "cover") setCoverUrl(sel.url);
		else if (picking?.kind === "frame") setFrame(picking.index, { imageUrl: sel.url });
		setPicking(null);
	};

	const save = async () => {
		setBusy(true);
		const payload = {
			title,
			category,
			client,
			location,
			year: Number(year) || new Date().getFullYear(),
			role,
			tone,
			vision,
			production,
			coverUrl,
			frames,
			...(study ? {} : { slug: slugify(title) || `case-${Date.now()}` }),
		};
		try {
			await fetch(study ? `/api/admin/casestudies/${study.id}` : "/api/admin/casestudies", {
				method: study ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			onDone();
		} finally {
			setBusy(false);
		}
	};

	return (
		<>
			<PaneHead>
				<div>
					<h1>{study ? "Edit case study" : "Add case study"}</h1>
					<p>{study ? study.title : "A new project story for /work"}</p>
				</div>
				<div className="actions">
					<Button variant="outline" onClick={onDone}>
						Cancel
					</Button>
					<Button variant="pri" onClick={save}>
						{busy ? "Saving…" : "Save case study"}
					</Button>
				</div>
			</PaneHead>
			<Split>
				<Card>
					<h2>Details</h2>
					<FormGrid>
						<div>
							<label htmlFor="cs-title">Title</label>
							<input
								id="cs-title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
						</div>
						<div className="row2">
							<div>
								<label htmlFor="cs-category">Category</label>
								<select
									id="cs-category"
									value={category}
									onChange={(e) => setCategory(e.target.value)}
								>
									{EDIT_CATEGORIES.map((c) => (
										<option key={c} value={c}>
											{c}
										</option>
									))}
								</select>
							</div>
							<div>
								<label htmlFor="cs-tone">Colour mood</label>
								<select
									id="cs-tone"
									value={tone}
									onChange={(e) => setTone(e.target.value as Tone)}
								>
									{TONES.map((t) => (
										<option key={t} value={t}>
											{t}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className="row2">
							<div>
								<label htmlFor="cs-client">Client</label>
								<input
									id="cs-client"
									value={client}
									onChange={(e) => setClient(e.target.value)}
								/>
							</div>
							<div>
								<label htmlFor="cs-role">Role</label>
								<input
									id="cs-role"
									value={role}
									onChange={(e) => setRole(e.target.value)}
								/>
							</div>
						</div>
						<div className="row2">
							<div>
								<label htmlFor="cs-location">Location</label>
								<input
									id="cs-location"
									value={location}
									onChange={(e) => setLocation(e.target.value)}
								/>
							</div>
							<div>
								<label htmlFor="cs-year">Year</label>
								<input
									id="cs-year"
									value={year}
									onChange={(e) => setYear(e.target.value)}
								/>
							</div>
						</div>
						<div>
							<label htmlFor="cs-vision">Vision</label>
							<textarea
								id="cs-vision"
								value={vision}
								onChange={(e) => setVision(e.target.value)}
							/>
						</div>
						<div>
							<label htmlFor="cs-production">Production notes</label>
							<textarea
								id="cs-production"
								value={production}
								onChange={(e) => setProduction(e.target.value)}
							/>
						</div>
						<div>
							{/* biome-ignore lint/a11y/noLabelWithoutControl: labels the cover picker */}
							<label>Cover image</label>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setPicking({ kind: "cover" })}
							>
								{coverUrl ? "Change cover" : "Choose cover"}
							</Button>
						</div>
					</FormGrid>
				</Card>

				<Stack>
					<Card>
						<h2>Cover preview</h2>
						<PreviewFrame>
							<Plate tone={tone} ratio="16/9" src={coverUrl || undefined} alt="" />
						</PreviewFrame>
						<PreviewMeta>
							<span className="pv-tag">
								{category} · {year}
							</span>
							<div className="pv-title">{title || "Untitled"}</div>
							<span className="pv-sub">
								{[client, location, role].filter(Boolean).join(" · ") ||
									"Add the project details"}
							</span>
						</PreviewMeta>
					</Card>

					<Card>
						<h2>Frames ({frames.length})</h2>
						<Stack>
							{frames.map((f, i) => (
								<RepeatRow key={i}>
									<div>
										<label htmlFor={`fr-tone-${i}`}>Colour mood</label>
										<select
											id={`fr-tone-${i}`}
											value={f.tone}
											onChange={(e) =>
												setFrame(i, { tone: e.target.value as Tone })
											}
										>
											{TONES.map((t) => (
												<option key={t} value={t}>
													{t}
												</option>
											))}
										</select>
									</div>
									<div>
										<label htmlFor={`fr-ratio-${i}`}>Frame shape</label>
										<input
											id={`fr-ratio-${i}`}
											value={f.ratio}
											placeholder="4/5"
											onChange={(e) => setFrame(i, { ratio: e.target.value })}
										/>
									</div>
									<div>
										{/* biome-ignore lint/a11y/noLabelWithoutControl: labels the frame picker */}
										<label>Image</label>
										<Button
											variant="outline"
											size="sm"
											onClick={() => setPicking({ kind: "frame", index: i })}
										>
											{f.imageUrl ? "Change" : "Choose"}
										</Button>
									</div>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => removeFrame(i)}
									>
										Remove
									</Button>
								</RepeatRow>
							))}
							<Button variant="outline" size="sm" onClick={addFrame}>
								Add frame
							</Button>
						</Stack>
					</Card>
				</Stack>
			</Split>

			{picking && <MediaPicker onPick={onPick} onClose={() => setPicking(null)} />}
		</>
	);
}

export default function AdminCaseStudiesWrapper() {
	const { data, isLoading, mutate } = useSWR<ApiCaseStudy[]>("/api/admin/casestudies", fetcher);
	const studies = data ?? [];
	const [editing, setEditing] = useState<ApiCaseStudy | "new" | null>(null);

	const remove = async (s: ApiCaseStudy) => {
		await fetch(`/api/admin/casestudies/${s.id}`, { method: "DELETE" });
		mutate();
	};

	if (editing) {
		return (
			<CaseStudyForm
				study={editing === "new" ? null : editing}
				onDone={() => {
					setEditing(null);
					mutate();
				}}
			/>
		);
	}

	return (
		<>
			<PaneHead>
				<div>
					<h1>Case studies</h1>
					<p>{studies.length} project stories on /work</p>
				</div>
				<div className="actions">
					<Button variant="pri" onClick={() => setEditing("new")}>
						Add case study
					</Button>
				</div>
			</PaneHead>

			{isLoading ? (
				<Muted>Loading case studies…</Muted>
			) : studies.length === 0 ? (
				<EmptyBox>
					<span className="eglyph" aria-hidden />
					<h2>No case studies yet</h2>
					<p>
						Add your first project story and it appears under /work on the public site.
					</p>
					<Button className="ebtn" variant="pri" onClick={() => setEditing("new")}>
						Add your first case study
					</Button>
				</EmptyBox>
			) : (
				<TableCard>
					<table>
						<thead>
							<tr>
								<th>Case study</th>
								<th>Category</th>
								<th>Year</th>
								<th>Frames</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{studies.map((s) => (
								<tr key={s.id}>
									<td>
										<span className="title">{s.title}</span>
										<span className="sub">{s.client || s.location}</span>
									</td>
									<td>{s.category}</td>
									<td>{s.year}</td>
									<td>{s.frames?.length ?? 0}</td>
									<td>
										<div className="row-actions">
											<Button
												variant="outline"
												size="sm"
												onClick={() => setEditing(s)}
											>
												Edit
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => remove(s)}
											>
												Delete
											</Button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</TableCard>
			)}
		</>
	);
}
