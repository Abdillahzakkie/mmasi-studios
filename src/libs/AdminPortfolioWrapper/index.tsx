"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { Button, Plate } from "@/components";
import MediaPicker from "@/components/MediaPicker";
import ShareDialog from "@/components/ShareDialog";
import { CATEGORIES } from "@/data";
import {
	Card,
	Chip,
	EmptyBox,
	FilterBar,
	FormGrid,
	Muted,
	PaneHead,
	Pill,
	PreviewFrame,
	PreviewMeta,
	Split,
	TableCard,
	Thumb,
} from "@/libs/adminUi";
import type { Category, Tone } from "@/types";

interface ApiPhoto {
	id: string;
	slug: string;
	title: string;
	category: string;
	location: string;
	year: number;
	camera: string;
	lens: string;
	caption: string;
	tone: Tone;
	ratio: string;
	status: "Published" | "Draft";
	imageKey: string;
	imageUrl: string;
}

const EDIT_CATEGORIES = CATEGORIES.filter((c) => c !== "All");
const fetcher = (url: string) => fetch(url).then((r) => r.json());
const slugify = (s: string) =>
	s
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");

/** Uploads a File to the server, which stores it; returns the stored url + key. */
async function uploadFile(file: File): Promise<{ url: string; key: string }> {
	const form = new FormData();
	form.append("file", file);
	const res = await fetch("/api/admin/upload", { method: "POST", body: form });
	if (!res.ok) throw new Error(`Upload failed (${res.status}).`);
	const { publicUrl, key } = await res.json();
	return { url: publicUrl, key };
}

function PhotoForm({ photo, onDone }: { photo: ApiPhoto | null; onDone: () => void }) {
	const [title, setTitle] = useState(photo?.title ?? "");
	const [category, setCategory] = useState<string>(photo?.category ?? "Portraits");
	const [imageUrl, setImageUrl] = useState(photo?.imageUrl ?? "");
	const [imageKey, setImageKey] = useState(photo?.imageKey ?? "");
	const [camera, setCamera] = useState(photo?.camera ?? "");
	const [lens, setLens] = useState(photo?.lens ?? "");
	const [year, setYear] = useState(String(photo?.year ?? new Date().getFullYear()));
	const [location, setLocation] = useState(photo?.location ?? "");
	const [caption, setCaption] = useState(photo?.caption ?? "");
	const [uploading, setUploading] = useState(false);
	const [uploadError, setUploadError] = useState("");
	const [picking, setPicking] = useState(false);
	const [busy, setBusy] = useState(false);

	const onFile = async (file: File) => {
		setUploading(true);
		setUploadError("");
		try {
			const { url, key } = await uploadFile(file);
			setImageUrl(url);
			setImageKey(key);
		} catch (e) {
			setUploadError((e as Error).message);
		} finally {
			setUploading(false);
		}
	};

	const save = async () => {
		setBusy(true);
		const payload = {
			title,
			category,
			location,
			year: Number(year) || new Date().getFullYear(),
			camera,
			lens,
			caption,
			tone: photo?.tone ?? "warm",
			ratio: photo?.ratio ?? "4/5",
			status: photo?.status ?? "Draft",
			imageUrl,
			imageKey,
			...(photo ? {} : { slug: slugify(title) || `photo-${Date.now()}` }),
		};
		try {
			await fetch(photo ? `/api/admin/photos/${photo.id}` : "/api/admin/photos", {
				method: photo ? "PUT" : "POST",
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
					<h1>{photo ? "Edit photograph" : "Add photograph"}</h1>
					<p>{photo ? photo.title : "A new frame for the portfolio"}</p>
				</div>
				<div className="actions">
					<Button variant="outline" onClick={onDone}>
						Cancel
					</Button>
					<Button variant="pri" onClick={save}>
						{busy ? "Saving…" : "Save photograph"}
					</Button>
				</div>
			</PaneHead>
			<Split>
				<Card>
					<h2>Details</h2>
					<FormGrid>
						<div>
							<label htmlFor="pf-category">Category</label>
							<select
								id="pf-category"
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
							<label htmlFor="pf-title">Title</label>
							<input
								id="pf-title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
						</div>
						<div>
							<label htmlFor="pf-file">Image file</label>
							<input
								id="pf-file"
								type="file"
								accept="image/*"
								onChange={(e) => {
									const f = e.target.files?.[0];
									if (f) onFile(f);
								}}
							/>
							<Button variant="outline" size="sm" onClick={() => setPicking(true)}>
								Choose from library
							</Button>
							{uploading && <Muted>Uploading…</Muted>}
							{uploadError && (
								<Muted style={{ color: "var(--mm-danger)" }}>{uploadError}</Muted>
							)}
						</div>
						<div>
							<label htmlFor="pf-image">Image URL</label>
							<input
								id="pf-image"
								placeholder="https://… (or upload above)"
								value={imageUrl}
								onChange={(e) => setImageUrl(e.target.value)}
							/>
						</div>
						<div className="row2">
							<div>
								<label htmlFor="pf-camera">Camera body</label>
								<input
									id="pf-camera"
									value={camera}
									onChange={(e) => setCamera(e.target.value)}
								/>
							</div>
							<div>
								<label htmlFor="pf-lens">Prime lens</label>
								<input
									id="pf-lens"
									value={lens}
									onChange={(e) => setLens(e.target.value)}
								/>
							</div>
						</div>
						<div className="row2">
							<div>
								<label htmlFor="pf-year">Year</label>
								<input
									id="pf-year"
									value={year}
									onChange={(e) => setYear(e.target.value)}
								/>
							</div>
							<div>
								<label htmlFor="pf-location">Location</label>
								<input
									id="pf-location"
									value={location}
									onChange={(e) => setLocation(e.target.value)}
								/>
							</div>
						</div>
						<div>
							<label htmlFor="pf-caption">Caption</label>
							<textarea
								id="pf-caption"
								value={caption}
								onChange={(e) => setCaption(e.target.value)}
							/>
						</div>
					</FormGrid>
				</Card>
				<Card>
					<h2>Live preview</h2>
					<PreviewFrame>
						<Plate
							tone={photo?.tone ?? "warm"}
							ratio={photo?.ratio ?? "4/5"}
							src={imageUrl || undefined}
							alt={title || "Preview"}
						/>
					</PreviewFrame>
					<PreviewMeta>
						<span className="pv-tag">
							{category} · {year}
						</span>
						<div className="pv-title">{title || "Untitled"}</div>
						<span className="pv-sub">
							{[location, camera, lens].filter(Boolean).join(" · ") ||
								"Add the capture details"}
						</span>
					</PreviewMeta>
				</Card>
			</Split>
			{picking && (
				<MediaPicker
					onPick={({ url, key }) => {
						setImageUrl(url);
						setImageKey(key);
						setPicking(false);
					}}
					onClose={() => setPicking(false)}
				/>
			)}
		</>
	);
}

export default function AdminPortfolioWrapper() {
	const { data, isLoading, mutate } = useSWR<ApiPhoto[]>("/api/admin/photos", fetcher);
	const photos = data ?? [];
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState<"All" | Category>("All");
	const [editing, setEditing] = useState<ApiPhoto | "new" | null>(null);
	const [sharing, setSharing] = useState<ApiPhoto | null>(null);

	const rows = useMemo(() => {
		const q = query.trim().toLowerCase();
		return photos.filter((p) => {
			const inCat = category === "All" || p.category === category;
			const inQuery =
				!q ||
				p.title.toLowerCase().includes(q) ||
				p.location.toLowerCase().includes(q) ||
				p.caption.toLowerCase().includes(q);
			return inCat && inQuery;
		});
	}, [photos, query, category]);

	const remove = async (p: ApiPhoto) => {
		await fetch(`/api/admin/photos/${p.id}`, { method: "DELETE" });
		mutate();
	};

	if (editing) {
		return (
			<PhotoForm
				photo={editing === "new" ? null : editing}
				onDone={() => {
					setEditing(null);
					mutate();
				}}
			/>
		);
	}

	const published = photos.filter((p) => p.status !== "Draft").length;

	return (
		<>
			<PaneHead>
				<div>
					<h1>Portfolio</h1>
					<p>
						{photos.length} photographs · {published} published
					</p>
				</div>
				<div className="actions">
					<Button variant="pri" onClick={() => setEditing("new")}>
						Add photograph
					</Button>
				</div>
			</PaneHead>

			<FilterBar>
				<input
					aria-label="Search photographs"
					placeholder="Search title, location or caption"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
				<select
					aria-label="Filter by category"
					value={category}
					onChange={(e) => setCategory(e.target.value as "All" | Category)}
				>
					{CATEGORIES.map((c) => (
						<option key={c} value={c}>
							{c === "All" ? "Category: All" : c}
						</option>
					))}
				</select>
			</FilterBar>

			{isLoading ? (
				<Muted>Loading photographs…</Muted>
			) : rows.length === 0 ? (
				<EmptyBox>
					<span className="eglyph" aria-hidden />
					<h2>No photographs yet</h2>
					<p>
						Add your first photograph and it appears in the public gallery under its
						category, ready to share with a client.
					</p>
					<Button className="ebtn" variant="pri" onClick={() => setEditing("new")}>
						Add your first photograph
					</Button>
				</EmptyBox>
			) : (
				<TableCard>
					<table>
						<thead>
							<tr>
								<th>Photograph</th>
								<th>Category</th>
								<th>Capture</th>
								<th>Status</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((p) => (
								<tr key={p.id}>
									<td>
										<div className="cell-main">
											<Thumb>
												<Plate
													tone={p.tone}
													ratio="1/1"
													src={p.imageUrl || undefined}
													alt={p.title}
												/>
											</Thumb>
											<div>
												<span className="title">{p.title}</span>
												<span className="sub">{p.location}</span>
											</div>
										</div>
									</td>
									<td>
										<Chip>{p.category}</Chip>
									</td>
									<td>
										{[p.camera, p.lens, p.year].filter(Boolean).join(" · ")}
									</td>
									<td>
										<Pill $tone={p.status === "Draft" ? "idle" : "ok"}>
											{p.status}
										</Pill>
									</td>
									<td>
										<div className="row-actions">
											<Button
												variant="wa"
												size="sm"
												onClick={() => setSharing(p)}
											>
												Share
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() => setEditing(p)}
											>
												Edit
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => remove(p)}
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
