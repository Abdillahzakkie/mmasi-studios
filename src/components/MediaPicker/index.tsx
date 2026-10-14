"use client";

import { useRef, useState } from "react";
import useSWR from "swr";
import { Button, Modal, Plate } from "@/components";
import { MediaGrid, MediaTile, Muted } from "@/libs/adminUi";
import { Body, Head, Panel } from "./styled";

interface MediaItem {
	key: string;
	url: string;
	size: number;
	lastModified: string;
	kind: "image" | "video" | "file";
}

interface Picked {
	url: string;
	key: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

async function uploadFile(file: File): Promise<Picked> {
	const form = new FormData();
	form.append("file", file);
	const res = await fetch("/api/admin/upload", { method: "POST", body: form });
	if (!res.ok) throw new Error(`Upload failed (${res.status}).`);
	const { publicUrl, key } = await res.json();
	return { url: publicUrl, key };
}

/**
 * A modal media picker: grids the bucket's assets of the requested kind, or
 * uploads a new one. `accept` ("image" by default, or "video") filters both the
 * library grid and the upload input.
 */
export default function MediaPicker({
	onPick,
	onClose,
	accept = "image",
}: {
	onPick: (sel: Picked) => void;
	onClose: () => void;
	accept?: "image" | "video";
}) {
	const { data, isLoading, mutate } = useSWR<MediaItem[]>("/api/admin/media", fetcher);
	const fileRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState("");

	const noun = accept === "video" ? "video" : "image";
	const items = (data ?? []).filter((m) => m.kind === accept);

	const onUpload = async (file: File) => {
		setUploading(true);
		setError("");
		try {
			const picked = await uploadFile(file);
			await mutate();
			onPick(picked);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Upload failed.");
		} finally {
			setUploading(false);
		}
	};

	return (
		<Modal onClose={onClose} label={`Choose ${noun === "video" ? "a video" : "an image"}`}>
			<Panel>
				<Head>
					<h3>Choose {noun === "video" ? "a video" : "an image"}</h3>
					<span className="trail">
						<Button
							variant="outline"
							size="sm"
							onClick={() => fileRef.current?.click()}
						>
							{uploading ? "Uploading…" : "Upload new"}
						</Button>
					</span>
					<input
						ref={fileRef}
						type="file"
						accept={`${noun}/*`}
						hidden
						onChange={(e) => {
							const f = e.target.files?.[0];
							if (f) onUpload(f);
						}}
					/>
				</Head>
				<Body>
					{error && <Muted>{error}</Muted>}
					{isLoading ? (
						<Muted>Loading media…</Muted>
					) : items.length === 0 ? (
						<Muted>No {noun}s yet. Upload one to begin.</Muted>
					) : (
						<MediaGrid>
							{items.map((m) => (
								<MediaTile
									key={m.key}
									type="button"
									onClick={() => onPick({ url: m.url, key: m.key })}
								>
									{m.kind === "video" ? (
										<video src={m.url} muted preload="metadata" />
									) : (
										<Plate tone="warm" ratio="1/1" src={m.url} alt="" />
									)}
									<span className="meta">{m.key.replace(/^uploads\//, "")}</span>
								</MediaTile>
							))}
						</MediaGrid>
					)}
				</Body>
			</Panel>
		</Modal>
	);
}
