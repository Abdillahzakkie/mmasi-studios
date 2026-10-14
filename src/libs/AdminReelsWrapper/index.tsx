"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button, Plate } from "@/components";
import MediaPicker from "@/components/MediaPicker";
import ShareDialog from "@/components/ShareDialog";
import {
	Badge,
	Card,
	FormGrid,
	Muted,
	PaneHead,
	Pill,
	PreviewFrame,
	PreviewMeta,
	Seg,
	Split,
	TableCard,
	Thumb,
} from "@/libs/adminUi";
import type { Tone } from "@/types";

interface ApiReel {
	id: string;
	slug: string;
	title: string;
	category: string;
	duration: string;
	tone: Tone;
	status: "Published" | "Draft";
	posterUrl: string;
	posterKey: string;
	videoUrl: string;
	videoKey: string;
}

interface ApiFilm extends ApiReel {
	synopsis: string;
	resolution: string;
	year: number;
	location: string;
}

type Kind = "reel" | "film";

interface MotionRow {
	kind: Kind;
	id: string;
	slug: string;
	title: string;
	sub: string;
	format: "9:16 Reel" | "16:9 Cinema";
	duration: string;
	resolution: string;
	tone: Tone;
	status: "Published" | "Draft";
	posterUrl: string;
	posterKey: string;
	videoUrl: string;
	videoKey: string;
	synopsis?: string;
	year?: number;
	location?: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const slugify = (s: string) =>
	s
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");

async function uploadFile(file: File): Promise<{ url: string; key: string }> {
	const form = new FormData();
	form.append("file", file);
	const res = await fetch("/api/admin/upload", { method: "POST", body: form });
	if (!res.ok) throw new Error(`Upload failed (${res.status}).`);
	const { publicUrl, key } = await res.json();
	return { url: publicUrl, key };
}

function ReelForm({ row, onDone }: { row: MotionRow | null; onDone: () => void }) {
	const [vertical, setVertical] = useState(row ? row.kind === "reel" : true);
	const [title, setTitle] = useState(row?.title ?? "");
	const [videoUrl, setVideoUrl] = useState(row?.videoUrl ?? "");
	const [videoKey, setVideoKey] = useState(row?.videoKey ?? "");
	const [posterUrl, setPosterUrl] = useState(row?.posterUrl ?? "");
	const [posterKey, setPosterKey] = useState(row?.posterKey ?? "");
	const [duration, setDuration] = useState(row?.duration ?? "");
	const [resolution, setResolution] = useState(row?.resolution ?? "4K UHD");
	const [synopsis, setSynopsis] = useState(row?.synopsis ?? "");
	const [uploading, setUploading] = useState("");
	const [picking, setPicking] = useState<null | "video" | "poster">(null);
	const [busy, setBusy] = useState(false);

	// An existing piece keeps its collection; the toggle only re-aspects a new one.
	const kind: Kind = row ? row.kind : vertical ? "reel" : "film";

	const onFile = async (file: File, which: "poster" | "video") => {
		setUploading(which);
		try {
			const { url, key } = await uploadFile(file);
			if (which === "poster") {
				setPosterUrl(url);
				setPosterKey(key);
			} else {
				setVideoUrl(url);
				setVideoKey(key);
			}
		} finally {
			setUploading("");
		}
	};

	const save = async () => {
		setBusy(true);
		const base = {
			title,
			category: row?.sub ?? "",
			duration,
			tone: row?.tone ?? (kind === "reel" ? "portrait" : "cool"),
			status: row?.status ?? "Draft",
			posterUrl,
			posterKey,
			videoUrl,
			videoKey,
			...(row ? {} : { slug: slugify(title) || `${kind}-${Date.now()}` }),
		};
		const payload =
			kind === "film"
				? {
						...base,
						synopsis,
						resolution,
						year: row?.year ?? new Date().getFullYear(),
						location: row?.location ?? "",
					}
				: base;
		const path = kind === "reel" ? "reels" : "films";
		try {
			await fetch(row ? `/api/admin/${path}/${row.id}` : `/api/admin/${path}`, {
				method: row ? "PUT" : "POST",
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
					<h1>{row ? "Edit reel" : "Add reel"}</h1>
					<p>{row ? row.title : "A new motion piece"}</p>
				</div>
				<div className="actions">
					<Button variant="outline" onClick={onDone}>
						Cancel
					</Button>
					<Button variant="pri" onClick={save}>
						{busy ? "Saving…" : "Save reel"}
					</Button>
				</div>
			</PaneHead>
			<Split>
				<Card>
					<h2>Details</h2>
					<FormGrid>
						<div>
							{/* biome-ignore lint/a11y/noLabelWithoutControl: labels a segmented control */}
							<label>Format</label>
							<Seg>
								<button
									type="button"
									data-on={vertical}
									disabled={!!row}
									onClick={() => setVertical(true)}
								>
									9:16 Vertical
								</button>
								<button
									type="button"
									data-on={!vertical}
									disabled={!!row}
									onClick={() => setVertical(false)}
								>
									16:9 Widescreen
								</button>
							</Seg>
						</div>
						<div>
							<label htmlFor="rf-title">Title</label>
							<input
								id="rf-title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
						</div>
						<div>
							<label htmlFor="rf-video">Video file</label>
							<input
								id="rf-video"
								type="file"
								accept="video/*"
								onChange={(e) => {
									const f = e.target.files?.[0];
									if (f) onFile(f, "video");
								}}
							/>
							<Button variant="outline" size="sm" onClick={() => setPicking("video")}>
								Choose from library
							</Button>
							{uploading === "video" && <Muted>Uploading video…</Muted>}
						</div>
						<div>
							<label htmlFor="rf-video-url">Video URL</label>
							<input
								id="rf-video-url"
								placeholder="https://… (or upload above)"
								value={videoUrl}
								onChange={(e) => setVideoUrl(e.target.value)}
							/>
						</div>
						<div>
							<label htmlFor="rf-poster">Poster file</label>
							<input
								id="rf-poster"
								type="file"
								accept="image/*"
								onChange={(e) => {
									const f = e.target.files?.[0];
									if (f) onFile(f, "poster");
								}}
							/>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setPicking("poster")}
							>
								Choose from library
							</Button>
							{uploading === "poster" && <Muted>Uploading poster…</Muted>}
						</div>
						<div>
							<label htmlFor="rf-poster-url">Poster URL</label>
							<input
								id="rf-poster-url"
								placeholder="https://… (or upload above)"
								value={posterUrl}
								onChange={(e) => setPosterUrl(e.target.value)}
							/>
						</div>
						<div className="row2">
							<div>
								<label htmlFor="rf-duration">Duration</label>
								<input
									id="rf-duration"
									placeholder="0:45"
									value={duration}
									onChange={(e) => setDuration(e.target.value)}
								/>
							</div>
							{!vertical && (
								<div>
									<label htmlFor="rf-resolution">Resolution</label>
									<input
										id="rf-resolution"
										value={resolution}
										onChange={(e) => setResolution(e.target.value)}
									/>
								</div>
							)}
						</div>
						{!vertical && (
							<div>
								<label htmlFor="rf-synopsis">Synopsis</label>
								<textarea
									id="rf-synopsis"
									value={synopsis}
									onChange={(e) => setSynopsis(e.target.value)}
								/>
							</div>
						)}
					</FormGrid>
				</Card>
				<Card>
					<h2>Live preview · {vertical ? "9:16" : "16:9"}</h2>
					<PreviewFrame>
						<Plate
							tone={row?.tone ?? "portrait"}
							ratio={vertical ? "9/16" : "16/9"}
							src={posterUrl || undefined}
							alt={title || "Preview"}
						/>
					</PreviewFrame>
					<PreviewMeta>
						<span className="pv-tag">{vertical ? "Reel" : "Cinema"}</span>
						<div className="pv-title">{title || "Untitled"}</div>
						<span className="pv-sub">
							{[duration, vertical ? null : resolution].filter(Boolean).join(" · ") ||
								"Add the running time"}
						</span>
					</PreviewMeta>
				</Card>
			</Split>
			{picking && (
				<MediaPicker
					accept={picking === "video" ? "video" : "image"}
					onPick={({ url, key }) => {
						if (picking === "video") {
							setVideoUrl(url);
							setVideoKey(key);
						} else {
							setPosterUrl(url);
							setPosterKey(key);
						}
						setPicking(null);
					}}
					onClose={() => setPicking(null)}
				/>
			)}
		</>
	);
}

export default function AdminReelsWrapper() {
	const {
		data: reels,
		isLoading: loadingReels,
		mutate: mutateReels,
	} = useSWR<ApiReel[]>("/api/admin/reels", fetcher);
	const {
		data: films,
		isLoading: loadingFilms,
		mutate: mutateFilms,
	} = useSWR<ApiFilm[]>("/api/admin/films", fetcher);
	const [editing, setEditing] = useState<MotionRow | "new" | null>(null);
	const [sharing, setSharing] = useState<MotionRow | null>(null);

	const refresh = () => {
		mutateReels();
		mutateFilms();
	};

	const rows: MotionRow[] = [
		...(reels ?? []).map(
			(r): MotionRow => ({
				kind: "reel",
				id: r.id,
				slug: r.slug,
				title: r.title,
				sub: r.category,
				format: "9:16 Reel",
				duration: r.duration,
				resolution: "—",
				tone: r.tone,
				status: r.status,
				posterUrl: r.posterUrl,
				posterKey: r.posterKey,
				videoUrl: r.videoUrl,
				videoKey: r.videoKey,
			}),
		),
		...(films ?? []).map(
			(f): MotionRow => ({
				kind: "film",
				id: f.id,
				slug: f.slug,
				title: f.title,
				sub: f.category,
				format: "16:9 Cinema",
				duration: f.duration,
				resolution: f.resolution,
				tone: f.tone,
				status: f.status,
				posterUrl: f.posterUrl,
				posterKey: f.posterKey,
				videoUrl: f.videoUrl,
				videoKey: f.videoKey,
				synopsis: f.synopsis,
				year: f.year,
				location: f.location,
			}),
		),
	];

	const remove = async (row: MotionRow) => {
		const path = row.kind === "reel" ? "reels" : "films";
		await fetch(`/api/admin/${path}/${row.id}`, { method: "DELETE" });
		refresh();
	};

	if (editing) {
		return (
			<ReelForm
				row={editing === "new" ? null : editing}
				onDone={() => {
					setEditing(null);
					refresh();
				}}
			/>
		);
	}

	const loading = loadingReels || loadingFilms;

	return (
		<>
			<PaneHead>
				<div>
					<h1>Reels &amp; films</h1>
					<p>
						{reels?.length ?? 0} reels · {films?.length ?? 0} cinema films
					</p>
				</div>
				<div className="actions">
					<Button variant="pri" onClick={() => setEditing("new")}>
						Add reel
					</Button>
				</div>
			</PaneHead>

			{loading ? (
				<Muted>Loading motion work…</Muted>
			) : (
				<TableCard>
					<table>
						<thead>
							<tr>
								<th>Film</th>
								<th>Format</th>
								<th>Duration</th>
								<th>Resolution</th>
								<th>Status</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((r) => (
								<tr key={`${r.kind}-${r.id}`}>
									<td>
										<div className="cell-main">
											<Thumb>
												<Plate
													tone={r.tone}
													ratio="1/1"
													src={r.posterUrl || undefined}
													alt={r.title}
												/>
											</Thumb>
											<div>
												<span className="title">{r.title}</span>
												<span className="sub">{r.sub}</span>
											</div>
										</div>
									</td>
									<td>
										<Badge>{r.format}</Badge>
									</td>
									<td>{r.duration}</td>
									<td>{r.resolution}</td>
									<td>
										<Pill $tone={r.status === "Draft" ? "idle" : "ok"}>
											{r.status}
										</Pill>
									</td>
									<td>
										<div className="row-actions">
											<Button
												variant="wa"
												size="sm"
												onClick={() => setSharing(r)}
											>
												Share
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() => setEditing(r)}
											>
												Edit
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => remove(r)}
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

			{sharing && (
				<ShareDialog
					title={sharing.title}
					slug={sharing.slug}
					onClose={() => setSharing(null)}
				/>
			)}
		</>
	);
}
