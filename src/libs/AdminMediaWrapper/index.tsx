"use client";

import { useRef, useState } from "react";
import useSWR from "swr";
import { Button, Modal, Plate } from "@/components";
import { Muted, PaneHead } from "@/libs/adminUi";
import { LightDialog, ManageGrid, MediaCard } from "./styled";

interface MediaItem {
	key: string;
	url: string;
	size: number;
	lastModified: string;
	kind: "image" | "video" | "file";
}

interface MediaRef {
	type: "Photo" | "Reel" | "Film" | "CaseStudy";
	id: string;
	title: string;
	field: "image" | "video" | "poster" | "cover" | "frame";
}

interface RefDialog {
	item: MediaItem;
	mode: "usage" | "delete";
	refs: MediaRef[];
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const filename = (key: string) => key.replace(/^uploads\//, "");

export default function AdminMediaWrapper() {
	const { data, isLoading, mutate } = useSWR<MediaItem[]>("/api/admin/media", fetcher);
	const items = data ?? [];

	const uploadRef = useRef<HTMLInputElement>(null);
	const replaceRef = useRef<HTMLInputElement>(null);
	const replaceKey = useRef<string | null>(null);

	const [uploading, setUploading] = useState(false);
	const [copied, setCopied] = useState("");
	const [renaming, setRenaming] = useState<string | null>(null);
	const [renameValue, setRenameValue] = useState("");
	const [renameErr, setRenameErr] = useState("");
	const [dialog, setDialog] = useState<RefDialog | null>(null);

	const onUpload = async (file: File) => {
		setUploading(true);
		try {
			const form = new FormData();
			form.append("file", file);
			await fetch("/api/admin/upload", { method: "POST", body: form });
			await mutate();
		} finally {
			setUploading(false);
		}
	};

	const copy = async (url: string, key: string) => {
		try {
			await navigator.clipboard.writeText(url);
			setCopied(key);
			setTimeout(() => setCopied(""), 2000);
		} catch {
			setCopied("");
		}
	};

	const startRename = (item: MediaItem) => {
		setRenaming(item.key);
		setRenameValue(filename(item.key));
		setRenameErr("");
	};

	const submitRename = async (item: MediaItem) => {
		const res = await fetch("/api/admin/media", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ key: item.key, name: renameValue }),
		});
		if (!res.ok) {
			const body = await res.json().catch(() => ({}));
			setRenameErr(res.status === 409 ? "Name taken." : body.error || "Could not rename.");
			return;
		}
		setRenaming(null);
		mutate();
	};

	const startReplace = (item: MediaItem) => {
		replaceKey.current = item.key;
		replaceRef.current?.click();
	};

	const onReplace = async (file: File) => {
		const key = replaceKey.current;
		if (!key) return;
		const form = new FormData();
		form.append("file", file);
		form.append("key", key);
		await fetch("/api/admin/media/replace", { method: "POST", body: form });
		replaceKey.current = null;
		mutate();
	};

	const openRefs = async (item: MediaItem, mode: "usage" | "delete") => {
		const res = await fetch(`/api/admin/media/references?key=${encodeURIComponent(item.key)}`);
		const body = await res.json().catch(() => ({ references: [] }));
		setDialog({ item, mode, refs: body.references ?? [] });
	};

	const doDelete = async (force: boolean) => {
		if (!dialog) return;
		await fetch(
			`/api/admin/media?key=${encodeURIComponent(dialog.item.key)}${force ? "&force=1" : ""}`,
			{ method: "DELETE" },
		);
		setDialog(null);
		mutate();
	};

	return (
		<>
			<PaneHead>
				<div>
					<h1>Media</h1>
					<p>{items.length} files in storage · click a thumbnail to copy its URL</p>
				</div>
				<div className="actions">
					<Button variant="pri" onClick={() => uploadRef.current?.click()}>
						{uploading ? "Uploading…" : "Upload file"}
					</Button>
					<input
						ref={uploadRef}
						type="file"
						hidden
						onChange={(e) => {
							const f = e.target.files?.[0];
							if (f) onUpload(f);
						}}
					/>
				</div>
			</PaneHead>

			{isLoading ? (
				<Muted>Loading media…</Muted>
			) : items.length === 0 ? (
				<Muted>No files yet. Upload one to begin.</Muted>
			) : (
				<ManageGrid>
					{items.map((m) => (
						<MediaCard key={m.key}>
							<button
								type="button"
								className="thumb"
								aria-label="Copy URL"
								onClick={() => copy(m.url, m.key)}
							>
								{m.kind === "image" ? (
									<Plate tone="warm" ratio="1/1" src={m.url} alt="" />
								) : m.kind === "video" ? (
									<video src={m.url} muted preload="metadata" />
								) : (
									<span className="ph">File</span>
								)}
							</button>

							<span className="meta">
								{copied === m.key
									? "Copied!"
									: `${filename(m.key)} · ${Math.max(1, Math.round(m.size / 1024))} KB`}
							</span>

							{renaming === m.key && (
								<div className="renamerow">
									<input
										aria-label="New file name"
										value={renameValue}
										onChange={(e) => setRenameValue(e.target.value)}
									/>
									<Button variant="pri" size="sm" onClick={() => submitRename(m)}>
										Save
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setRenaming(null)}
									>
										Cancel
									</Button>
								</div>
							)}
							{renaming === m.key && renameErr && (
								<span className="err">{renameErr}</span>
							)}

							<div className="actions">
								{renaming !== m.key && (
									<Button
										variant="outline"
										size="sm"
										onClick={() => startRename(m)}
									>
										Rename
									</Button>
								)}
								<Button variant="outline" size="sm" onClick={() => startReplace(m)}>
									Replace
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => openRefs(m, "usage")}
								>
									Used
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => openRefs(m, "delete")}
								>
									Delete
								</Button>
								<a
									href={`/api/admin/media/download?key=${encodeURIComponent(m.key)}`}
								>
									Download
								</a>
							</div>
						</MediaCard>
					))}
				</ManageGrid>
			)}

			<input
				ref={replaceRef}
				type="file"
				hidden
				onChange={(e) => {
					const f = e.target.files?.[0];
					if (f) onReplace(f);
				}}
			/>

			{dialog && (
				<Modal
					hideClose
					onClose={() => setDialog(null)}
					label={dialog.mode === "delete" ? "Delete file" : "Where it's used"}
				>
					<LightDialog>
						<div className="dhead">
							<h3>
								{dialog.mode === "delete" ? "Delete this file?" : "Where it's used"}
							</h3>
							<p>{filename(dialog.item.key)}</p>
						</div>
						<div className="dbody">
							{dialog.refs.length === 0 ? (
								<Muted>
									{dialog.mode === "delete"
										? "Not used anywhere. This file will be permanently removed."
										: "Not used by any photo, reel, film or case study."}
								</Muted>
							) : (
								<>
									{dialog.mode === "delete" && (
										<Muted>
											Used in {dialog.refs.length} place
											{dialog.refs.length === 1 ? "" : "s"}. Deleting breaks
											these references:
										</Muted>
									)}
									<ul className="reflist">
										{dialog.refs.map((r) => (
											<li key={`${r.type}-${r.id}-${r.field}`}>
												<span className="rtype">{r.type}</span>
												<span>{r.title}</span>
												<span className="rfield">{r.field}</span>
											</li>
										))}
									</ul>
								</>
							)}
						</div>
						<div className="dfoot">
							<Button variant="outline" onClick={() => setDialog(null)}>
								Close
							</Button>
							{dialog.mode === "delete" &&
								(dialog.refs.length === 0 ? (
									<Button variant="danger" onClick={() => doDelete(false)}>
										Delete
									</Button>
								) : (
									<Button variant="danger" onClick={() => doDelete(true)}>
										Delete anyway
									</Button>
								))}
						</div>
					</LightDialog>
				</Modal>
			)}
		</>
	);
}
